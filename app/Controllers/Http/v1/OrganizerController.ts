import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ApiDocument } from 'App/Helpers/Api/Document';
import Organizer, { OrganizerStatus } from 'App/Models/Organizer';
import OrganizerManager from 'App/Helpers/Managers/OrganizerManager';

// TODO(matthiasrohmer): Add permissions
export default class OrganizerController {
  public async index(ctx: HttpContextContract) {
    const manager: OrganizerManager = new OrganizerManager(ctx);
    await manager.all();

    return new ApiDocument(ctx, manager.toResources(), {
      paginator: manager.paginator,
    });
  }

  public async store(ctx: HttpContextContract) {
    const manager: OrganizerManager = new OrganizerManager(ctx);
    await manager.fromContext();

    return new ApiDocument(ctx, manager.toResources());
  }

  public async show(ctx: HttpContextContract) {
    const manager: OrganizerManager = new OrganizerManager(ctx);
    await manager.fromContext();

    const organizer: Organizer = manager.instance;
    const publishable = await organizer.publishable();

    return new ApiDocument(ctx, manager.toResources(), { publishable });
  }

  public async update(ctx: HttpContextContract) {
    const manager: OrganizerManager = new OrganizerManager(ctx);
    await manager.fromContext();

    const organizer: Organizer = manager.instance;
    const publishable = await organizer.publishable();

    if (publishable !== true) {
      organizer.status = OrganizerStatus.DRAFT;
      if (organizer.$isDirty) {
        await organizer.save();
      }
    }

    return new ApiDocument(ctx, manager.toResources(), {
      publishable,
    });
  }

  // public async destroy(ctx: HttpContextContract) {
  //   const { params, auth } = ctx;
  //   if (!auth.user) {
  //     throw new UnauthorizedException();
  //   }

  //   const organizer = await Organizer.query()
  //     .preload('address')
  //     .where('cid', params.id)
  //     .firstOrFail();
  //   const address = organizer.address;

  //   await Promise.all([organizer.delete(), address.delete()]);

  //   return new ApiDocument(ctx, {}, 'Organizer deleted successfully');
  // }
}
