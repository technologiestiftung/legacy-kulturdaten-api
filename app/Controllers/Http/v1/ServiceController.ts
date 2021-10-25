import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ApiDocument } from 'App/Helpers/Api/Document';
import { Service } from 'App/Models/Location';
import ServiceManager from 'App/Helpers/Managers/ServiceManager';

export default class ServiceController {
  public async show(ctx: HttpContextContract) {
    const manager = new ServiceManager(ctx);

    await manager.byId();
    return new ApiDocument(ctx, manager.toResources());
  }

  public async update(ctx: HttpContextContract) {
    const manager = new ServiceManager(ctx);
    await manager.update();

    return new ApiDocument(ctx, manager.toResources());
  }

  public async delete(ctx: HttpContextContract) {
    const manager = new ServiceManager(ctx);
    return new ApiDocument(ctx, await manager.delete());
  }
}
