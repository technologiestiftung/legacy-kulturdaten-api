import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BaseManager from 'App/Helpers/Managers/BaseManager';
import OrganizerModel, { OrganizerTranslation } from 'App/Models/Organizer';
import OrganizerResource from 'App/Helpers/Api/Resources/Organizer';
import { withTranslations } from 'App/Helpers/Utilities';
import { CreateOrganizerValidator } from 'App/Validators/v1/OrganizerValidator';
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
        organizerTypeId: relations?.type?.id,
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

  public;
}
