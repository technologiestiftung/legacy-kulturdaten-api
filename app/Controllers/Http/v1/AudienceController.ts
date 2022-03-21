import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ApiDocument } from 'App/Helpers/Api/Document';
import { Audience } from 'App/Models/Offer';
import AudienceManager from 'App/Helpers/Managers/AudienceManager';

export default class AudienceController {
  public async show(ctx: HttpContextContract) {
    const manager = new AudienceManager(ctx);
    await manager.byId();

    const document = new ApiDocument(ctx, manager.toResources());
    await document.send();
  }

  public async update(ctx: HttpContextContract) {
    const manager = new AudienceManager(ctx);
    await manager.update();

    const document = new ApiDocument(ctx, manager.toResources());
    await document.send();
  }

  public async delete(ctx: HttpContextContract) {
    const manager = new AudienceManager(ctx);

    const document = new ApiDocument(ctx, await manager.delete());
    await document.send();
  }
}
