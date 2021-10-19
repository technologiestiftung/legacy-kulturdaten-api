import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ApiDocument } from 'App/Helpers/Api/Document';
import { Accessibility } from 'App/Models/Location';
import AccessibilityManager from 'App/Helpers/Managers/AccessibilityManager';

export default class AccessibilityController {
  public async show(ctx: HttpContextContract) {
    const manager = new AccessibilityManager(ctx);

    await manager.byId();
    return new ApiDocument(ctx, manager.toResources());
  }

  public async update(ctx: HttpContextContract) {
    const manager = new AccessibilityManager(ctx);
    await manager.update();

    return new ApiDocument(ctx, manager.toResources());
  }

  public async delete(ctx: HttpContextContract) {
    const manager = new AccessibilityManager(ctx);
    return new ApiDocument(ctx, await manager.delete());
  }
}
