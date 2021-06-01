import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BaseManager from 'App/Helpers/Managers/BaseManager';
import OrganizerModel from 'App/Models/Organizer';
import OrganizerResource from 'App/Helpers/Api/Resources/Organizer';
import { withTranslations } from 'App/Helpers/Utilities';

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
}
