import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ApiDocument } from 'App/Helpers/Api/Document';
import { Audience } from 'App/Models/Offer';
import AudienceManager from 'App/Helpers/Managers/AudienceManager';

export default class AudienceController {
  public async show(ctx: HttpContextContract) {
    const manager = new AudienceManager(ctx);

    await manager.byId();
    return new ApiDocument(ctx, manager.toResources());
  }

  public async update(ctx: HttpContextContract) {
    const manager = new AudienceManager(ctx);
    await manager.update();

    return new ApiDocument(ctx, manager.toResources());
  }

  public async delete(ctx: HttpContextContract) {
    const manager = new AudienceManager(ctx);
    return new ApiDocument(ctx, await manager.delete());
  }
}
