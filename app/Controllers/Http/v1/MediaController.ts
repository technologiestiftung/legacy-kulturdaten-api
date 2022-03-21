import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ApiDocument } from 'App/Helpers/Api/Document';
import Media from 'App/Models/Media';
import MediaManager from 'App/Helpers/Managers/MediaManager';

export default class MediaController {
  public async show(ctx: HttpContextContract) {
    const manager: MediaManager = new MediaManager(ctx);
    await manager.byId();

    const document = new ApiDocument(ctx, manager.toResources());
    await document.send();
  }

  public async update(ctx: HttpContextContract) {
    const manager: MediaManager = new MediaManager(ctx);
    await manager.update();

    const document = new ApiDocument(ctx, manager.toResources());
    await document.send();
  }

  public async destroy(ctx: HttpContextContract) {
    const manager = new MediaManager(ctx);

    const document = new ApiDocument(ctx, await manager.delete());
    await document.send();
  }
}
