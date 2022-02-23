import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ApiDocument } from 'App/Helpers/Api/Document';
import Offer, { OfferStatus } from 'App/Models/Offer/Offer';
import OfferManager from 'App/Helpers/Managers/OfferManager';
import { OfferTransformer } from 'App/Helpers/Api/Transformers/OfferTransformer';

// TODO(matthiasrohmer): Add permissions
export default class OfferController {
  public async index(ctx: HttpContextContract) {
    const manager: OfferManager = new OfferManager(ctx);
    await manager.all();

    const document = new ApiDocument(ctx, manager.toResources(), {
      paginator: manager.paginator,
      transformer: OfferTransformer,
    });
    await document.send();
  }

  public async store(ctx: HttpContextContract) {
    const manager: OfferManager = new OfferManager(ctx);
    await manager.create();

    const document = new ApiDocument(ctx, manager.toResources());
    await document.send();
  }

  public async show(ctx: HttpContextContract) {
    const manager: OfferManager = new OfferManager(ctx);
    await manager.byId();

    const offer: Offer = manager.instance;
    const publishable = await offer.publishable();

    const document = new ApiDocument(ctx, manager.toResources(), {
      publishable,
      transformer: OfferTransformer,
    });
    await document.send();
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

    const document = new ApiDocument(ctx, manager.toResources(), {
      publishable,
    });
    await document.send();
  }

  public async destroy(ctx: HttpContextContract) {
    const manager = new OfferManager(ctx);

    const document = new ApiDocument(ctx, await manager.delete());
    await document.send();
  }
}
