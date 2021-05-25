import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import OrganizerTypeValidator from 'App/Validators/v1/OrganizerTypeValidator';
import { UnauthorizedException } from 'App/Exceptions/Auth';
import { ApiDocument } from 'App/Helpers/Api';
import OrganizerType from 'App/Models/OrganizerType';

// TODO(matthiasrohmer): Add permissions
export default class OrganizerTypeController {
  public async index(ctx: HttpContextContract) {
    const organizerType = await OrganizerType.query().preload('subjects');
    return new ApiDocument(ctx, { data: organizerType });
  }

  public async store(ctx: HttpContextContract) {
    const { request, auth } = ctx;
    if (!auth.user) {
      throw new UnauthorizedException();
    }

    const data = await request.validate(OrganizerTypeValidator);
    const organizerType = await OrganizerType.create(data);

    return new ApiDocument(
      ctx,
      { data: organizerType },
      'Organizer type created successfully'
    );
  }

  public async show(ctx: HttpContextContract) {
    const { params } = ctx;
    const organizerType = await OrganizerType.query()
      .where('id', params.id)
      .preload('subjects')
      .firstOrFail();

    return new ApiDocument(ctx, { data: organizerType });
  }

  public async update(ctx: HttpContextContract) {
    const { auth, request, params } = ctx;
    if (!auth.user) {
      throw new UnauthorizedException();
    }

    const data = await request.validate(OrganizerTypeValidator);

    const organizerType = await OrganizerType.query()
      .where('id', params.id)
      .firstOrFail();

    organizerType.merge(data);
    await organizerType.save();

    return new ApiDocument(
      ctx,
      { data: organizerType },
      'Organizer type updated successfully'
    );
  }

  public async destroy(ctx: HttpContextContract) {
    const { params, auth } = ctx;
    if (!auth.user) {
      throw new UnauthorizedException();
    }

    const organizerType = await OrganizerType.query()
      .where('id', params.id)
      .firstOrFail();
    await organizerType.delete();

    return new ApiDocument(ctx, {}, 'Organizer type deleted successfully');
  }
}
