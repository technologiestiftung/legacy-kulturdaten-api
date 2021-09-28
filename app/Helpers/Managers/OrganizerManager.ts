import BaseManager from 'App/Helpers/Managers/BaseManager';
import Organizer, { OrganizerStatus } from 'App/Models/Organizer';
import { withTranslations } from 'App/Helpers/Utilities';
import {
  CreateOrganizerValidator,
  UpdateOrganizerValidator,
} from 'App/Validators/v1/OrganizerValidator';
import { OrganizerTranslationValidator } from 'App/Validators/v1/OrganizerTranslationValidator';
import Address from 'App/Models/Address';
import Database from '@ioc:Adonis/Lucid/Database';
import Application from '@ioc:Adonis/Core/Application';
import Media, { MEDIA_BASE_PATH } from 'App/Models/Media';
import { cuid } from '@ioc:Adonis/Core/Helpers';
import { join } from 'path';

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
        name: 'address',
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
        query: (query) => {
          withTranslations(query);
          query.preload('renditions');
        },
      },
      {
        name: 'logo',
        query: (query) => {
          withTranslations(query);
          query.preload('renditions');
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
    translate: OrganizerTranslationValidator,
  };

  constructor(ctx) {
    super(ctx, Organizer);
  }

  private async $createAddress(organizer, attributes, trx) {
    const address = new Address();
    address.fill(attributes);

    address.useTransaction(trx);
    await address.save();
    await organizer.related('address').associate(address);

    return address;
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

    const fileName = `${cuid()}.${logo.extname}`;
    await logo.move(Application.publicPath(MEDIA_BASE_PATH), {
      name: fileName,
    });

    const media = new Media();
    media.renditionSizes = [48, 96, 144];

    media.fill({
      url: join(MEDIA_BASE_PATH, fileName),
      filesize: logo.size,
    });
    await media.save();

    await organizer.related('logo').associate(media);
    await organizer.load('logo', (query) => {
      return query.preload('renditions');
    });
    console.log('done');
  }

  public async create() {
    const { attributes, relations } = await this.ctx.request.validate(
      new CreateOrganizerValidator(this.ctx)
    );

    const organizer = new Organizer();
    await Database.transaction(async (trx) => {
      organizer.useTransaction(trx);
      organizer.fill(attributes, true);
      await organizer.save();

      await organizer.related('translations').create({
        name: attributes.name,
        description: attributes.description,
        language: this.language,
      });
      await organizer.load('translations');

      if (relations?.address) {
        await this.$createAddress(organizer, relations.address.attributes, trx);
      }

      await this.$updateSubjects(organizer, relations?.subjects);
      await this.$updateTypes(organizer, relations?.types);
      await this.$updateTags(organizer, relations?.tags);
      await this.$updateLinks(organizer, relations?.links);
      await this.$storeMedia(organizer);
    });

    // Storing the logo needs to happen outside the transaction
    // as it creates a belongsTo relationship
    await this.$storeLogo(organizer);

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

      if (relations?.address) {
        if (organizer.address) {
          organizer.address.merge(relations.address.attributes);
          await organizer.address.save();
        } else {
          await this.$createAddress(
            organizer,
            relations.address.attributes,
            trx
          );
        }
      }

      await this.$updateSubjects(organizer, relations?.subjects);
      await this.$updateTypes(organizer, relations?.types);
      await this.$updateTags(organizer, relations?.tags);
      await this.$updateLinks(organizer, relations?.links);
      await this.$storeMedia(organizer);
    });

    await this.$storeLogo(organizer);

    return this.instance;
  }

  public async translate() {
    const attributes = await this.$validateTranslation();

    // Creating an organizer translation without a name is forbidden,
    // but initially creating one without a name is impossible. Hence fallback
    // to the initial name
    if (!attributes.name) {
      attributes.name = this.instance?.translations?.find((translation) => {
        return translation.name;
      })?.name;
    }

    await this.$saveTranslation(attributes);
    return this.instance;
  }
}
