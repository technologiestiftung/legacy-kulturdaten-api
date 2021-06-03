import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BaseManager from 'App/Helpers/Managers/BaseManager';
import OrganizerModel from 'App/Models/Organizer';
import OrganizerResource from 'App/Helpers/Api/Resources/Organizer';
import { withTranslations, findTranslation } from 'App/Helpers/Utilities';
import {
  CreateOrganizerValidator,
  UpdateOrganizerValidator,
} from 'App/Validators/v1/OrganizerValidator';
import Address from 'App/Models/Address';
import Database from '@ioc:Adonis/Lucid/Database';

export default class OrganizerManager extends BaseManager {
  public ModelClass = OrganizerModel;
  public OrganizerClass = OrganizerResource;

  public queryId = 'public_id';

  constructor(ctx: HttpContextContract) {
    super(ctx, OrganizerModel, OrganizerResource);
  }

  public query() {
    return super
      .query()
      .preload('address')
      .preload('type', withTranslations)
      .preload('subjects', withTranslations);
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
        const address = new Address();
        address.fill(relations.address.attributes);

        address.useTransaction(trx);
        await address.save();
        await organizer.related('address').associate(address);
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
      organizer.merge({
        organizerTypeId: relations?.type,
      });

      organizer.useTransaction(trx);
      await organizer.save();

      const translatedFields = {
        name: attributes?.name,
        description: attributes?.description,
        language: this.language,
      };

      const translation = findTranslation(
        organizer.translations,
        this.language
      );
      if (translation) {
        translation.merge(translatedFields);
        translation.useTransaction(trx);

        await translation.save();
      } else {
        await organizer.related('translations').create(translatedFields);
      }

      // Check if any of adress, type or subject have been given
      if (relations?.address) {
        const address = organizer.address;
        address.merge(relations.address.attributes);
        address.useTransaction(trx);

        await address.save();
      }

      if (relations?.subjects) {
        await organizer.related('subjects').sync(relations?.subjects);
      }
    });

    return await this.byId(organizer.publicId);
  }
}
