import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ApiDocument } from 'App/Helpers/Api';
import OrganizerManager from 'App/Helpers/Managers/OrganizerManager';

// TODO(matthiasrohmer): Add permissions
export default class OrganizerController {
  public async index(ctx: HttpContextContract) {
    const manager: OrganizerManager = new OrganizerManager(ctx);
    await manager.all();

    return new ApiDocument(ctx, manager.toResources());
  }

  public async store(ctx: HttpContextContract) {
    const manager: OrganizerManager = new OrganizerManager(ctx);
    await manager.fromContext();

    return new ApiDocument(ctx, manager.toResources());
  }

  public async show(ctx: HttpContextContract) {
    const manager: OrganizerManager = new OrganizerManager(ctx);
    await manager.fromContext();

    return new ApiDocument(ctx, manager.toResources());
  }

  // public async update(ctx: HttpContextContract) {
  //   const { auth, request, params } = ctx;
  //   if (!auth.user) {
  //     throw new UnauthorizedException();
  //   }

  //   const data = await request.validate(OrganizerValidator);

  //   const organizer = await Organizer.query()
  //     .where('cid', params.id)
  //     .preload('address')
  //     .preload('type')
  //     .firstOrFail();
  //   const address = organizer.address;

  //   organizer.merge(data);
  //   organizer.merge({ organizerTypeId: data.type });

  //   await organizer.related('subjects').sync(data.subjects);

  //   address.merge(data.address);

  //   await Promise.all([organizer.save(), address.save()]);
  //   await Promise.all([organizer.load('type'), organizer.load('subjects')]);

  //   return new ApiDocument(
  //     ctx,
  //     { data: organizer },
  //     'Organizer updated successfully'
  //   );
  // }

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
