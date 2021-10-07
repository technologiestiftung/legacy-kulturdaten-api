import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ApiDocument } from 'App/Helpers/Api/Document';
import Offer, { OfferStatus } from 'App/Models/Offer';
import OfferManager from 'App/Helpers/Managers/OfferManager';

// TODO(matthiasrohmer): Add permissions
export default class OfferController {
  public async index(ctx: HttpContextContract) {
    const manager: OfferManager = new OfferManager(ctx);
    await manager.all();

    return new ApiDocument(ctx, manager.toResources(), {
      paginator: manager.paginator,
    });
  }

  public async store(ctx: HttpContextContract) {
    const manager: OfferManager = new OfferManager(ctx);
    await manager.create();

    return new ApiDocument(ctx, manager.toResources());
  }

  public async show(ctx: HttpContextContract) {
    const manager: OfferManager = new OfferManager(ctx);

    await manager.byId();

    const offer: Offer = manager.instance;
    const publishable = await offer.publishable();

    return new ApiDocument(ctx, manager.toResources(), { publishable });
  }

  public async update(ctx: HttpContextContract) {
    const manager: OfferManager = new OfferManager(ctx);
    await manager.update();

    const publishable = await manager.instance.publishable();
    if (publishable !== true) {
      manager.instance.status = OfferStatus.DRAFT;
      if (manager.instance.$isDirty) {
        await manager.instance.save();
      }
    }

    return new ApiDocument(ctx, manager.toResources(), {
      publishable,
    });
  }
}
