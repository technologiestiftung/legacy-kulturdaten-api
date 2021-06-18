import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BaseManager from 'App/Helpers/Managers/BaseManager';
import OrganizerModel from 'App/Models/Organizer';
import { withTranslations } from 'App/Helpers/Utilities';
import {
  CreateOrganizerValidator,
  UpdateOrganizerValidator,
} from 'App/Validators/v1/OrganizerValidator';
import {
  CreateOrganizerTranslationValidator,
  UpdateOrganizerTranslationValidator,
} from 'App/Validators/v1/OrganizerTranslationValidator';
import Address from 'App/Models/Address';
import Database from '@ioc:Adonis/Lucid/Database';

export default class OrganizerManager extends BaseManager {
  public ModelClass = OrganizerModel;

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
    ],
  };

  public validators = {
    translations: {
      create: CreateOrganizerTranslationValidator,
      update: UpdateOrganizerTranslationValidator,
    },
  };

  constructor(ctx: HttpContextContract) {
    super(ctx, OrganizerModel);
  }

  private async $createAddress(organizer, attributes, trx) {
    const address = new Address();
    address.fill(attributes);

    address.useTransaction(trx);
    await address.save();
    await organizer.related('address').associate(address);

    return address;
  }

  public async create() {
    const { attributes, relations } = await this.ctx.request.validate(
      new CreateOrganizerValidator(this.ctx)
    );

    const organizer = new OrganizerModel();
    await Database.transaction(async (trx) => {
      organizer.fill({
        organizerTypeId: relations?.type,
      });

      organizer.useTransaction(trx);
      await organizer.save();

      await organizer.related('translations').create({
        name: attributes.name,
        description: attributes.description,
        language: this.language,
      });

      // Check if any of adress, type or subject have been given
      if (relations?.address) {
        await this.$createAddress(organizer, relations.address.attributes, trx);
      }

      if (relations?.subjects) {
        await organizer.related('subjects').sync(relations?.subjects);
      }
    });

    return await this.byId(organizer.publicId);
  }

  public async update() {
    // Fetch the organizer even before input has been validated, as subject
    // validation relies on the set type
    await this.byId(this.ctx.params.id);
    const organizer = this.instance as OrganizerModel;

    const { attributes, relations } = await this.ctx.request.validate(
      new UpdateOrganizerValidator(this.ctx, organizer)
    );

    await Database.transaction(async (trx) => {
      organizer.organizerTypeId = relations?.type || organizer.organizerTypeId;
      organizer.status = attributes?.status || organizer.status;

      organizer.useTransaction(trx);
      if (organizer.$isDirty) {
        await organizer.save();
      }

      // Check if any of adress, type or subject have been given
      if (relations?.address) {
        if (organizer.address) {
          organizer.address.merge(relations.address.attributes);
          organizer.address.useTransaction(trx);

          await organizer.address.save();
        } else {
          await this.$createAddress(
            organizer,
            relations.address.attributes,
            trx
          );
        }
      }

      if (relations?.subjects) {
        await organizer.related('subjects').sync(relations?.subjects);
      }
    });

    return await this.byId(organizer.publicId);
  }
}
