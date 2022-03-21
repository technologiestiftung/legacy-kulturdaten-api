import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ApiDocument } from 'App/Helpers/Api/Document';
import ServiceManager from 'App/Helpers/Managers/ServiceManager';

export default class ServiceController {
  public async show(ctx: HttpContextContract) {
    const manager = new ServiceManager(ctx);
    await manager.byId();

    const document = new ApiDocument(ctx, manager.toResources());
    await document.send();
  }

  public async update(ctx: HttpContextContract) {
    const manager = new ServiceManager(ctx);
    await manager.update();

    const document = new ApiDocument(ctx, manager.toResources());
    await document.send();
  }

  public async delete(ctx: HttpContextContract) {
    const manager = new ServiceManager(ctx);

    const document = new ApiDocument(ctx, await manager.delete());
    await document.send();
  }
}
