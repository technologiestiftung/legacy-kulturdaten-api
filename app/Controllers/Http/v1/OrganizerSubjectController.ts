import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ApiDocument } from 'App/Helpers/Api/Document';
import OrganizerSubjectManager from 'App/Helpers/Managers/OrganizerSubjectManager';

export default class OrganizerSubjectController {
  public async index(ctx: HttpContextContract) {
    const manager: OrganizerSubjectManager = new OrganizerSubjectManager(ctx);
    await manager.all();

    const document = new ApiDocument(ctx, manager.toResources());
    await document.send();
  }
}
