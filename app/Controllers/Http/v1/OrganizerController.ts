import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import OrganizerValidator from 'App/Validators/v1/OrganizerValidator';
import Organizer from 'App/Models/Organizer';
import { UnauthorizedException } from 'App/Exceptions/Auth';
import { ApiDocument } from 'App/Helpers/Api';
import Address from 'App/Models/Address';
import OrganizerManager from 'App/Helpers/Managers/OrganizerManager';

// TODO(matthiasrohmer): Add permissions
export default class OrganizerController {
  public async index(ctx: HttpContextContract) {
    const manager: OrganizerManager = await OrganizerManager.all(ctx);
    return new ApiDocument(ctx, manager.toResources());
  }

  // public async store(ctx: HttpContextContract) {
  //   const { request, auth } = ctx;
  //   if (!auth.user) {
  //     throw new UnauthorizedException();
  //   }

  //   const data = await request.validate(OrganizerValidator);
  //   const organizer = await Organizer.create(data);
  //   const address = await Address.create(data.address);

  //   await organizer.related('address').associate(address);
  //   await organizer.related('members').save(auth.user);

  //   return new ApiDocument(
  //     ctx,
  //     { data: organizer },
  //     'Organizer created successfully'
  //   );
  // }

  public async show(ctx: HttpContextContract) {
    const manager: OrganizerManager = await OrganizerManager.fromContext(ctx);
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
