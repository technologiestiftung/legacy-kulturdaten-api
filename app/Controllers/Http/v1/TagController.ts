import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ApiDocument } from 'App/Helpers/Api/Document';
import Tag from 'App/Models/Tag';
import TagManager from 'App/Helpers/Managers/TagManager';

export default class TagController {
  public async index(ctx: HttpContextContract) {
    const manager = new TagManager(ctx);
    await manager.all();

    return new ApiDocument(ctx, manager.toResources());
  }

  public async show(ctx: HttpContextContract) {
    const manager = new TagManager(ctx);

    await manager.byId();
    return new ApiDocument(ctx, manager.toResources());
  }
}
