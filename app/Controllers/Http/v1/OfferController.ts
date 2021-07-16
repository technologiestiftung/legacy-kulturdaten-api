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

    const offer: Offer = await manager.byId();
    const publishable = await offer.publishable();

    if (publishable !== true) {
      offer.status = OfferStatus.DRAFT;
      if (offer.$isDirty) {
        await offer.save();
      }
    }

    return new ApiDocument(ctx, manager.toResources(), {
      publishable,
    });
  }

  public async translate(ctx: HttpContextContract) {
    const manager: OfferManager = new OfferManager(ctx);
    await manager.byId();
    await manager.translate();

    return new ApiDocument(ctx, manager.toResources());
  }
}
