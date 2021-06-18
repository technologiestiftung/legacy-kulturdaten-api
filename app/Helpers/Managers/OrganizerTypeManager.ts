import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BaseManager from 'App/Helpers/Managers/BaseManager';
import OrganizerType from 'App/Models/OrganizerType';
import { withTranslations } from 'App/Helpers/Utilities';

export default class OrganizerTypeManager extends BaseManager {
  public ModelClass = OrganizerType;

  constructor(ctx: HttpContextContract) {
    super(ctx, OrganizerType);
  }

  public query() {
    return super.query().preload('subjects', withTranslations);
  }
}
