import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ApiDocument } from 'App/Helpers/Api/Document';
import OfferTypeManager from 'App/Helpers/Managers/OfferTypeManager';

export default class OfferTypeController {
  public async index(ctx: HttpContextContract) {
    const manager: OfferTypeManager = new OfferTypeManager(ctx);
    await manager.all();

    const document = new ApiDocument(ctx, manager.toResources());
    await document.send();
  }
}
