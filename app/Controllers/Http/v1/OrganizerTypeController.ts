import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ApiDocument } from 'App/Helpers/Api/Document';
import OrganizerTypeManager from 'App/Helpers/Managers/OrganizerTypeManager';

export default class OrganizerTypeController {
  public async index(ctx: HttpContextContract) {
    const manager: OrganizerTypeManager = new OrganizerTypeManager(ctx);
    await manager.all();

    const document = new ApiDocument(ctx, manager.toResources());
    await document.send();
  }
}
