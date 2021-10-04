import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ApiDocument } from 'App/Helpers/Api/Document';
import Media from 'App/Models/Media';
import MediaManager from 'App/Helpers/Managers/MediaManager';

export default class MediaController {
  public async show(ctx: HttpContextContract) {
    const manager: MediaManager = new MediaManager(ctx);

    await manager.byId();
    return new ApiDocument(ctx, manager.toResources());
  }

  public async update(ctx: HttpContextContract) {
    const manager: MediaManager = new MediaManager(ctx);
    await manager.update();

    return new ApiDocument(ctx, manager.toResources());
  }
}
