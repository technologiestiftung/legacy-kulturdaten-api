import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BaseManager from 'App/Helpers/Managers/BaseManager';
import { OfferMainType } from 'App/Models/Offer';

export default class OfferMainTypeManager extends BaseManager<
  typeof OfferMainType
> {
  public ModelClass = OfferMainType;

  constructor(ctx: HttpContextContract) {
    super(ctx, OfferMainType);
  }
}
