import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import OrganizerValidator from 'App/Validators/v1/OrganizerValidator';
import Organizer from 'App/Models/Organizer';
import { UnauthorizedException } from 'App/Exceptions/Auth';
import { ApiDocument } from 'App/Helpers/Api';

// TODO(matthiasrohmer): Add permissions
export default class OrganizerController {
  public async index({ request, response }: HttpContextContract) {
    const organizers = await Organizer.query().preload('address');

    return new ApiDocument(response, { data: organizers });
  }

  public async store({ request, response, auth }: HttpContextContract) {
    if (!auth.user) {
      throw new UnauthorizedException();
    }

    const data = await request.validate(OrganizerValidator);
    const organizer = await Organizer.create(data);

    await organizer.related('members').save(auth.user);

    return new ApiDocument(
      response,
      { data: organizer },
      'Organizer created successfully'
    );
  }

  public async show({ request, response, params, auth }: HttpContextContract) {
    const organizer = await Organizer.query()
      .preload('address')
      .where('id', params.id)
      .firstOrFail();

    return new ApiDocument(response, { data: organizer });
  }

  public async update({
    request,
    response,
    params,
    auth,
  }: HttpContextContract) {
    if (!auth.user) {
      throw new UnauthorizedException();
    }

    const data = await request.validate(OrganizerValidator);

    const organizer = await Organizer.findOrFail(params.id);
    organizer.merge(data);
    await organizer.save();

    return new ApiDocument(
      response,
      { data: organizer },
      'Organizer updated successfully'
    );
  }

  public async destroy({
    request,
    response,
    params,
    auth,
  }: HttpContextContract) {
    if (!auth.user) {
      throw new UnauthorizedException();
    }

    const organizer = await Organizer.findOrFail(params.id);
    await organizer.delete();

    return new ApiDocument(response, {}, 'Organizer deleted successfully');
  }
}
