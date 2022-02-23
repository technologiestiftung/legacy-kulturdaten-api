import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ApiDocument } from 'App/Helpers/Api/Document';
import Organizer, { OrganizerStatus } from 'App/Models/Organizer/Organizer';
import OrganizerManager from 'App/Helpers/Managers/OrganizerManager';
import { OrganizerTransformer } from 'App/Helpers/Api/Transformers/OrganizerTransformer';

export default class OrganizerController {
  public async index(ctx: HttpContextContract) {
    const manager = new OrganizerManager(ctx);
    await manager.all();

    const document = new ApiDocument(ctx, manager.toResources(), {
      paginator: manager.paginator,
      transformer: OrganizerTransformer,
    });
    await document.send();
  }

  public async store(ctx: HttpContextContract) {
    const manager = new OrganizerManager(ctx);
    await manager.create();

    const document = new ApiDocument(ctx, manager.toResources());
    await document.send();
  }

  public async show(ctx: HttpContextContract) {
    const manager = new OrganizerManager(ctx);
    await manager.byId();

    const organizer: Organizer = manager.instance;
    const publishable = await organizer.publishable();

    const document = new ApiDocument(ctx, manager.toResources(), {
      publishable,
      transformer: OrganizerTransformer,
    });
    await document.send();
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

    const document = new ApiDocument(ctx, manager.toResources(), {
      publishable,
    });
    await document.send();
  }

  public async destroy(ctx: HttpContextContract) {
    const manager = new OrganizerManager(ctx);

    const document = new ApiDocument(ctx, await manager.delete());
    await document.send();
  }
}
