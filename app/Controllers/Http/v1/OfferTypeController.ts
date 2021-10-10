import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import OfferTypeValidator from 'App/Validators/v1/OfferTypeValidator';
import { UnauthorizedException } from 'App/Exceptions/Auth';
import { ApiDocument } from 'App/Helpers/Api/Document';
import OfferType from 'App/Models/Offer/OfferType';
import OfferTypeManager from 'App/Helpers/Managers/OfferTypeManager';

// TODO(matthiasrohmer): Add permissions
export default class OfferTypeController {
  public async index(ctx: HttpContextContract) {
    const manager: OfferTypeManager = new OfferTypeManager(ctx);
    await manager.all();

    return new ApiDocument(ctx, manager.toResources());
  }
}
