import BaseManager from 'App/Helpers/Managers/BaseManager';
import Organizer, { OrganizerStatus } from 'App/Models/Organizer/Organizer';
import OrganizerContact from 'App/Models/Organizer/OrganizerContact';
import { queryMedia, withTranslations } from 'App/Helpers/Utilities';
import {
  CreateOrganizerValidator,
  UpdateOrganizerValidator,
  DeleteOrganizerValidator,
} from 'App/Validators/v1/OrganizerValidator';
import { translation } from 'App/Validators/v1/OrganizerTranslationValidator';
import Address from 'App/Models/Address';
import Database from '@ioc:Adonis/Lucid/Database';
import Media from 'App/Models/Media';
import { OrganizerRole } from 'App/Models/Roles';
import { Roles } from '../Roles';
import User from 'App/Models/User';

export default class OrganizerManager extends BaseManager<typeof Organizer> {
  public ManagedModel = Organizer;

  public settings = {
    queryId: 'public_id',
    orderableBy: [
      {
        name: 'name',
        query: Database.raw(
          `(SELECT name FROM organizer_translations WHERE organizer_translations.organizer_id = organizers.id AND organizer_translations.language = '${this.language}')`
        ),
      },
      {
        name: 'createdAt',
        attribute: 'created_at',
      },
      {
        name: 'updatedAt',
        attribute: 'updated_at',
      },
    ],
    includables: [
      {
        name: 'mainContact',
        query: (query) => {
          withTranslations(query);
          query.preload('address');
        },
      },
      {
        name: 'contacts',
        query: (query) => {
          withTranslations(query);
          query.whereNotIn(
            'id',
            Database.from('organizers')
              .whereNotNull('main_contact_id')
              .select('main_contact_id')
          );
        },
      },
      {
        name: 'types',
        query: withTranslations,
      },
      {
        name: 'subjects',
        query: withTranslations,
      },
      {
        name: 'tags',
        query: withTranslations,
      },
      { name: 'links' },
      {
        name: 'media',
        query: queryMedia,
      },
      {
        name: 'logo',
        query: queryMedia,
      },
      {
        name: 'roles',
        query: (query) => {
          query.preload('user');
        },
      },
    ],
    filters: [
      {
        name: 'status',
        query: (query, name, value) => {
          if (
            ![OrganizerStatus.DRAFT, OrganizerStatus.PUBLISHED].includes(value)
          ) {
            return query;
          }

          return query.where('status', 'LIKE', value);
        },
      },
      {
        name: 'type',
        query: (query, name, value) => {
          return query.whereHas('types', (query) => {
            query.where('organizer_type_id', '=', value);
          });
        },
      },
      {
        name: 'subject',
        query: (query, name, value) => {
          return query.whereHas('subjects', (query) => {
            query.where('organizer_subject_id', '=', value);
          });
        },
      },
    ],
  };

  public validators = {
    translation,
  };

  constructor(ctx) {
    super(ctx, Organizer);
  }

  private async $updateTypes(organizer: Organizer, types) {
    if (types) {
      await organizer.related('types').sync(types);
      await organizer.load('types', withTranslations);
    }
  }

  private async $updateSubjects(organizer: Organizer, subjects) {
    if (subjects) {
      await organizer.related('subjects').sync(subjects);
      await organizer.load('subjects', withTranslations);
    }
  }

  private async $storeLogo(organizer: Organizer) {
    const logo = this.ctx.request.file('logo');
    if (!logo) {
      return;
    }

    await logo.moveToDisk('./');

    const media = new Media();
    media.renditionSizes = [48, 96, 144];
    media.fill({
      path: logo.fileName,
      filesize: logo.size,
    });

    await media.save();

    await organizer.related('logo').associate(media);
    await organizer.load('logo', (query) => {
      return query.preload('renditions');
    });
  }

  private async $updateRoles(organizer, roles: any[] = []) {
    if (!roles.length) {
      return;
    }

    const emails = roles.map((role) => {
      return role.attributes.email;
    });
    const existingUsers = emails.length
      ? await User.query().whereIn('email', emails)
      : [];
    const existingRoles = emails.length
      ? await OrganizerRole.query()
          .where('organizerId', organizer.publicId)
          .whereIn('email', emails)
      : [];

    return this.$updateMany(
      organizer,
      'roles',
      roles.map((role) => {
        for (const existingRole of existingRoles) {
          if (existingRole.email === role.attributes.email) {
            role.id = existingRole.id;
            continue;
          }
        }

        for (const existingUser of existingUsers) {
          if (existingUser.email === role.attributes.email) {
            role.attributes.userId = existingUser.id;
            continue;
          }
        }

        return role;
      }),
      (rolesQuery) =>
        rolesQuery.preload('user', (userQuery) => {
          userQuery.select('email');
        })
    );
  }

  private async $updateMainContact(organizer: Organizer, data) {
    if (!data) {
      return;
    }

    if (organizer.mainContactId) {
      const mainContact = await OrganizerContact.find(organizer.mainContactId);
      mainContact!.merge(data.attributes);
      if (mainContact!.$isDirty) {
        await mainContact!.save();
      }
    } else {
      const mainContact = await OrganizerContact.create(data.attributes);
      await organizer.related('mainContact').associate(mainContact);
    }

    await organizer.refresh();
    await organizer.load('mainContact');

    await this.$translate(organizer.mainContact, data.relations?.translations);

    if (organizer.mainContact.addressId) {
      const address = await Address.find(organizer.mainContact.addressId);
      await address!.merge(data.relations?.address?.attributes);
      if (address!.$isDirty) {
        await address!.save();
      }
    } else {
      const address = await Address.create(data.relations?.address?.attributes);
      await organizer.mainContact.related('address').associate(address);
    }

    await organizer.load('mainContact', (query) => {
      query.preload('translations');
      query.preload('address');
    });
  }

  public async create() {
    const { attributes, relations } = await this.ctx.request.validate(
      new CreateOrganizerValidator(this.ctx)
    );

    const organizer = new Organizer();
    await Database.transaction(async (trx) => {
      organizer.useTransaction(trx);
      organizer.fill(attributes || {}, true);
      await organizer.save();

      await this.$bootstrapTranslations(organizer);
      await this.$translate(organizer);

      await this.$updateSubjects(organizer, relations?.subjects);
      await this.$updateTypes(organizer, relations?.types);
      await this.$updateTags(organizer, relations?.tags);
      await this.$updateLinks(organizer, relations?.links);
      await this.$storeMedia(organizer);
    });

    // Storing the logo needs to happen outside the transaction
    // as it creates a belongsTo relationship
    await this.$storeLogo(organizer);
    await this.$updateMainContact(organizer, relations?.mainContact);
    await this.$updateMany(organizer, 'contacts', relations?.contacts);

    // Create a role for the user creating the organizer
    await new OrganizerRole()
      .fill({
        organizerId: organizer.publicId,
        userId: this.ctx.auth.user!.id,
        email: this.ctx.auth.user!.email,
        role: Roles.OWNER,
      })
      .save();
    await organizer.load('roles');

    this.instance = organizer;
    return this.instance;
  }

  public async update() {
    const { attributes, relations } = await this.ctx.request.validate(
      new UpdateOrganizerValidator(this.ctx)
    );

    const organizer = await this.byId();
    await Database.transaction(async (trx) => {
      organizer.homepage = attributes?.homepage || organizer.homepage;
      organizer.phone = attributes?.phone || organizer.phone;
      organizer.email = attributes?.email || organizer.email;
      organizer.status = attributes?.status || organizer.status;

      organizer.useTransaction(trx);
      if (organizer.$isDirty) {
        await organizer.save();
      }

      await this.$translate(organizer);
      await this.$updateSubjects(organizer, relations?.subjects);
      await this.$updateTypes(organizer, relations?.types);
      await this.$updateTags(organizer, relations?.tags);
      await this.$updateLinks(organizer, relations?.links);
      await this.$storeMedia(organizer);
    });

    await this.$storeLogo(organizer);
    await this.$updateMainContact(organizer, relations?.mainContact);
    await this.$updateMany(organizer, 'contacts', relations?.contacts);
    await this.$updateRoles(organizer, relations?.roles);

    return this.instance;
  }

  public async delete() {
    const { attributes, relations } = await this.ctx.request.validate(
      new DeleteOrganizerValidator(this.ctx)
    );

    return [
      ...(await this.$deleteObjects(OrganizerContact, relations?.contacts)),
      ...(await this.$deleteObjects(Media, relations?.media)),
      ...(await this.$deleteObjects(OrganizerRole, relations?.roles)),
      ...(await this.$deleteObject(Media, relations?.logo)),
      ...(await this.$deleteObject(Organizer, attributes?.id, 'public_id')),
    ];
  }
}
