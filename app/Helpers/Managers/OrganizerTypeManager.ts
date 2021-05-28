import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BaseManager from 'App/Helpers/Managers/BaseManager';
import OrganizerTypeModel from 'App/Models/OrganizerType';
import OrganizerTypeResource from 'App/Helpers/Api/Resources/OrganizerType';

export default class OrganizerTypeManager extends BaseManager {
  public ModelClass = OrganizerTypeModel;
  public RessourceClass = OrganizerTypeResource;

  constructor(ctx: HttpContextContract) {
    super(ctx, OrganizerTypeModel, OrganizerTypeResource);
  }

  public query() {
    return super.query().preload('subjects', (query) => {
      query.preload('translations');
    });
  }
}
