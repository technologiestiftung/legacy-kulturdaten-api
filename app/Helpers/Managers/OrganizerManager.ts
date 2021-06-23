import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BaseManager from 'App/Helpers/Managers/BaseManager';
import Organizer from 'App/Models/Organizer';
import { withTranslations } from 'App/Helpers/Utilities';
import {
  CreateOrganizerValidator,
  UpdateOrganizerValidator,
} from 'App/Validators/v1/OrganizerValidator';
import { OrganizerTranslationValidator } from 'App/Validators/v1/OrganizerTranslationValidator';
import Address from 'App/Models/Address';
import Database from '@ioc:Adonis/Lucid/Database';

export default class OrganizerManager extends BaseManager {
  public ModelClass = Organizer;

  public settings = {
    queryId: 'public_id',
    orderableBy: [
      {
        name: 'name',
        query: Database.raw(
          `(SELECT name FROM organizer_translations WHERE organizer_translations.organizer_id = organizers.id)`
        ),
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
      { name: 'links' },
    ],
  };

  public validators = {
    translate: OrganizerTranslationValidator,
  };

  constructor(ctx: HttpContextContract) {
    super(ctx, Organizer);
  }

  private async $createAddress(organizer, attributes, trx) {
    const address = new Address();
    await organizer.related();
    address.fill(attributes);

    address.useTransaction(trx);
    await address.save();
    await organizer.related('address').associate(address);

    return address;
  }

  private async $updateTypes(organizer: Organizer, types) {
    if (types) {
      await organizer.related('types').sync(types);
    }
  }

  private async $updateSubjects(organizer: Organizer, subjects) {
    if (subjects) {
      await organizer.related('subjects').sync(subjects);
    }
  }

  private async $updateLinks(organizer: Organizer, links) {
    if (links) {
      await organizer.load('links');

      let index = 0;
      while (organizer.links[index] || links[index]) {
        const link = organizer.links[index];
        const url = links[index];

        if (link && url) {
          const link = organizer.links[index];
          link.url = links[index];
          await link.save();
        } else if (!link && url) {
          await organizer.related('links').create({ url });
        } else if (link && !url) {
          await link.delete();
        }

        index++;
      }
    }
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

      if (relations?.address) {
        await this.$createAddress(organizer, relations.address.attributes, trx);
      }

      await this.$updateSubjects(organizer, relations?.subjects);
      await this.$updateTypes(organizer, relations?.types);
      await this.$updateLinks(organizer, relations?.links);
    });

    return await this.byId(organizer.publicId);
  }

  public async update() {
    const { attributes, relations } = await this.ctx.request.validate(
      new UpdateOrganizerValidator(this.ctx)
    );

    const organizer = (await this.byId()) as Organizer;
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
      await this.$updateLinks(organizer, relations?.links);
    });

    return await this.byId(organizer.publicId);
  }

  public async translate() {
    const attributes = await this.$validateTranslation();

    // Creating an organizer translation without a name is forbidden,
    // but initially creating one without a name is impossible. Hence fallback
    // to the initial name
    if (!attributes.name) {
      attributes.name = this.instance.translations.find((translation) => {
        return translation.name;
      }).name;
    }

    await this.$saveTranslation(attributes);

    return this.byId();
  }
}
