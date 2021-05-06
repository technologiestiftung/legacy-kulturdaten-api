import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import OrganizerValidator from 'App/Validators/v1/OrganizerValidator';
import Organizer from 'App/Models/Organizer';
import { UnauthorizedException } from 'App/Exceptions/Auth';
import { ApiDocument } from 'App/Helpers/Api';

// TODO(matthiasrohmer): Add permissions
export default class OrganizerController {
  public async index(ctx: HttpContextContract) {
    const organizers = await Organizer.query().preload('address');
    return new ApiDocument(ctx, { data: organizers });
  }

  public async store(ctx: HttpContextContract) {
    const { request, auth } = ctx;
    if (!auth.user) {
      throw new UnauthorizedException();
    }

    const data = await request.validate(OrganizerValidator);
    const organizer = await Organizer.create(data);

    await organizer.related('members').save(auth.user);

    return new ApiDocument(
      ctx,
      { data: organizer },
      'Organizer created successfully'
    );
  }

  public async show(ctx: HttpContextContract) {
    const { response, params } = ctx;
    const organizer = await Organizer.query()
      .preload('address')
      .where('uid', params.id)
      .firstOrFail();

    return new ApiDocument(ctx, { data: organizer });
  }

  public async update(ctx: HttpContextContract) {
    const { auth, request } = ctx;
    if (!auth.user) {
      throw new UnauthorizedException();
    }

    const data = await request.validate(OrganizerValidator);

    const organizer = await Organizer.query()
      .preload('address')
      .where('uid', params.id)
      .firstOrFail();
    const address = organizer.address;
    
    organizer.merge(data);
    address.merge(data.address);

    await Promise.all([
      organizer.save();
      address.save();
    ]);

    return new ApiDocument(
      ctx,
      { data: organizer },
      'Organizer updated successfully'
    );
  }

  public async destroy(ctx: HttpContextContract) {
    const { response, params } = ctx;
    if (!auth.user) {
      throw new UnauthorizedException();
    }

    const organizer = await Organizer.preload('address').where(
      'uid',
      params.id
    );
    const address = organizer.address;

    await Promise.all([
      organizer.delete(),
      address.delete()
    ]);

    return new ApiDocument(ctx, {}, 'Organizer deleted successfully');
  }
}
