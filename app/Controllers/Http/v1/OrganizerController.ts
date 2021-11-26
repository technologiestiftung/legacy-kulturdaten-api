import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ApiDocument } from 'App/Helpers/Api/Document';
import Organizer, { OrganizerStatus } from 'App/Models/Organizer/Organizer';
import OrganizerManager from 'App/Helpers/Managers/OrganizerManager';
import { OrganizerTransformer } from 'App/Helpers/Api/Transformers/OrganizerTransformer';

// TODO(matthiasrohmer): Add permissions
export default class OrganizerController {
  public async index(ctx: HttpContextContract) {
    const manager = new OrganizerManager(ctx);
    await manager.all();

    return new ApiDocument(ctx, manager.toResources(), {
      paginator: manager.paginator,
      transformer: OrganizerTransformer,
    });
  }

  public async store(ctx: HttpContextContract) {
    const manager = new OrganizerManager(ctx);
    await manager.create();

    return new ApiDocument(ctx, manager.toResources());
  }

  public async show(ctx: HttpContextContract) {
    const manager = new OrganizerManager(ctx);

    manager.include = 'address,types,subjects';
    await manager.byId();

    const organizer: Organizer = manager.instance;
    const publishable = await organizer.publishable();

    return new ApiDocument(ctx, manager.toResources(), {
      publishable,
      transformer: OrganizerTransformer,
    });
  }

  public async update(ctx: HttpContextContract) {
    const manager = new OrganizerManager(ctx);
    await manager.update();

    const publishable = await manager.instance.publishable();
    if (publishable !== true) {
      manager.instance.status = OrganizerStatus.DRAFT;
      if (manager.instance.$isDirty) {
        await manager.instance.save();
      }
    }

    return new ApiDocument(ctx, manager.toResources(), {
      publishable,
    });
  }

  public async destroy(ctx: HttpContextContract) {
    const manager = new OrganizerManager(ctx);
    return new ApiDocument(ctx, await manager.delete());
  }
}
