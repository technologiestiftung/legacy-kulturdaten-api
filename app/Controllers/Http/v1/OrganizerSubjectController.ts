import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import OrganizerSubjectValidator from 'App/Validators/v1/OrganizerSubjectValidator';
import { UnauthorizedException } from 'App/Exceptions/Auth';
import { ApiDocument } from 'App/Helpers/Api';
import OrganizerSubject from 'App/Models/OrganizerSubject';

// TODO(matthiasrohmer): Add permissions
export default class OrganizerSubjectController {
  public async index(ctx: HttpContextContract) {
    const { params } = ctx;

    const organizerSubjects = await OrganizerSubject.query()
      .where('organizer_type_id', params.organizer_type_id)
      .preload('type');

    return new ApiDocument(ctx, { data: organizerSubjects });
  }

  public async store(ctx: HttpContextContract) {
    const { request, auth } = ctx;
    if (!auth.user) {
      throw new UnauthorizedException();
    }

    const data = await request.validate(OrganizerSubjectValidator);

    const organizerSubject = await OrganizerSubject.create({
      name: data.name,
      organizerTypeId: data.params.organizer_type_id,
    });

    return new ApiDocument(
      ctx,
      { data: organizerSubject },
      'Organizer subject created successfully'
    );
  }

  public async show(ctx: HttpContextContract) {
    const { response, params } = ctx;
    const organizerSubject = await OrganizerSubject.query()
      .where('id', params.id)
      .preload('type')
      .firstOrFail();

    return new ApiDocument(ctx, { data: organizerSubject });
  }

  public async update(ctx: HttpContextContract) {
    const { auth, request, params } = ctx;
    if (!auth.user) {
      throw new UnauthorizedException();
    }

    const data = await request.validate(OrganizerSubjectValidator);

    const organizerSubject = await OrganizerSubject.query()
      .where('id', params.id)
      .preload('type')
      .firstOrFail();

    organizerSubject.merge({ name: data.name });
    await organizerSubject.save();

    return new ApiDocument(
      ctx,
      { data: organizerSubject },
      'Organizer subject updated successfully'
    );
  }

  public async destroy(ctx: HttpContextContract) {
    const { params, auth } = ctx;
    if (!auth.user) {
      throw new UnauthorizedException();
    }

    const organizerSubject = await OrganizerSubject.query()
      .where('id', params.id)
      .firstOrFail();
    await organizerSubject.delete();

    return new ApiDocument(ctx, {}, 'Organizer subject deleted successfully');
  }
}
