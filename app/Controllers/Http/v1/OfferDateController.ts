import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ApiDocument } from 'App/Helpers/Api/Document';
import OfferDateManager from 'App/Helpers/Managers/OfferDateManager';

// TODO(matthiasrohmer): Add permissions
export default class OfferDateController {
  public async index(ctx: HttpContextContract) {
    const manager: OfferDateManager = new OfferDateManager(ctx);
    await manager.all();

    return new ApiDocument(ctx, manager.toResources(), {
      paginator: manager.paginator,
    });
  }

  public async store(ctx: HttpContextContract) {
    const manager: OfferDateManager = new OfferDateManager(ctx);
    await manager.create();

    return new ApiDocument(ctx, manager.toResources());
  }

  public async show(ctx: HttpContextContract) {
    const manager: OfferDateManager = new OfferDateManager(ctx);

    await manager.byId();

    return new ApiDocument(ctx, manager.toResources());
  }

  public async update(ctx: HttpContextContract) {
    const manager: OfferDateManager = new OfferDateManager(ctx);
    await manager.update();

    return new ApiDocument(ctx, manager.toResources());
  }
}
