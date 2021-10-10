import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BaseManager from 'App/Helpers/Managers/BaseManager';
import OfferType from 'App/Models/Offer/OfferType';
import { withTranslations } from 'App/Helpers/Utilities';

export default class OfferTypeManager extends BaseManager<typeof OfferType> {
  public ModelClass = OfferType;

  constructor(ctx: HttpContextContract) {
    super(ctx, OfferType);
  }

  public query() {
    return super.query().preload('subjects', withTranslations);
  }
}
