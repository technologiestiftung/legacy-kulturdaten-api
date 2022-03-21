import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ApiDocument } from 'App/Helpers/Api/Document';
import OfferMainTypeManager from 'App/Helpers/Managers/OfferMainTypeManager';

export default class OfferTypeController {
  public async index(ctx: HttpContextContract) {
    const manager = new OfferMainTypeManager(ctx);
    await manager.all();

    const document = new ApiDocument(ctx, manager.toResources());
    await document.send();
  }
}
