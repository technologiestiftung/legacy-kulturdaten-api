import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ApiDocument } from 'App/Helpers/Api/Document';
import OfferDateManager from 'App/Helpers/Managers/OfferDateManager';
import { OfferTransformer } from 'App/Helpers/Api/Transformers/OfferTransformer';

export default class OfferDateController {
  public async index(ctx: HttpContextContract) {
    const manager: OfferDateManager = new OfferDateManager(ctx);

    const document = new ApiDocument(ctx, manager.toResources(), {
      paginator: manager.paginator,
      transformer: OfferTransformer,
    });
    await document.send();
  }

  public async store(ctx: HttpContextContract) {
    const manager: OfferDateManager = new OfferDateManager(ctx);
    await manager.create();

    const document = new ApiDocument(ctx, manager.toResources());
    await document.send();
  }

  public async show(ctx: HttpContextContract) {
    const manager: OfferDateManager = new OfferDateManager(ctx);
    await manager.byId();

    const document = new ApiDocument(ctx, manager.toResources());
    await document.send();
  }

  public async update(ctx: HttpContextContract) {
    const manager: OfferDateManager = new OfferDateManager(ctx);
    await manager.update();

    const document = new ApiDocument(ctx, manager.toResources());
    await document.send();
  }

  public async destroy(ctx: HttpContextContract) {
    const manager = new OfferDateManager(ctx);

    const document = new ApiDocument(ctx, await manager.delete());
    await document.send();
  }
}
