import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ApiDocument } from 'App/Helpers/Api/Document';
import OrganizerManager from 'App/Helpers/Managers/OrganizerManager';

export default class OrganizerTranslationController {
  public async store(ctx: HttpContextContract) {
    const manager: OrganizerManager = new OrganizerManager(ctx);
    await manager.byId(ctx.params.organizer_id);

    await manager.translate();

    return new ApiDocument(ctx, manager.toResources());
  }

  public async update(ctx: HttpContextContract) {
    const manager: OrganizerManager = new OrganizerManager(ctx);
    await manager.byId(ctx.params.organizer_id);

    await manager.translate();

    return new ApiDocument(ctx, manager.toResources());
  }
}
