import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BaseManager from 'App/Helpers/Managers/BaseManager';
import OrganizerModel from 'App/Models/Organizer';
import OrganizerResource from 'App/Helpers/Api/Resources/Organizer';

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
      .preload('translations')
      .preload('address')
      .preload('type', (query) => {
        query.preload('translations');
      })
      .preload('subjects', (query) => {
        query.preload('translations');
      });
  }
}
