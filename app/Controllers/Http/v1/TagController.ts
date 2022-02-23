import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ApiDocument } from 'App/Helpers/Api/Document';
import TagManager from 'App/Helpers/Managers/TagManager';

export default class TagController {
  public async index(ctx: HttpContextContract) {
    const manager = new TagManager(ctx);
    await manager.all();

    const document = new ApiDocument(ctx, manager.toResources());
    await document.send();
  }

  public async show(ctx: HttpContextContract) {
    const manager = new TagManager(ctx);

    await manager.byId();
    const document = new ApiDocument(ctx, manager.toResources());
    await document.send();
  }
}
