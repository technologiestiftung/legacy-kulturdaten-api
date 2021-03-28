import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import OrganisationValidator from 'App/Validators/v1/Private/OrganisationValidator';
import Organisation from 'App/Models/Organisation';
import UnauthorizedException from 'App/Exceptions/UnauthorizedException';

// TODO(matthiasrohmer): Add permissions
export default class OrganisationController {
  public async index({ request, response }: HttpContextContract) {
    const organisations = await Organisation.all();

    return response.ok({
      organisations,
      status: 200,
    });
  }

  public async store({ request, response, auth }: HttpContextContract) {
    if (!auth.user) {
      throw new UnauthorizedException();
    }

    const data = await request.validate(OrganisationValidator);
    const organisation = await Organisation.create(data);

    await organisation.related('members').save(auth.user);

    return response.ok({
      organisation,
      status: 200,
      message: 'Organisation created successfully',
    });
  }

  public async show({ request, response, params, auth }: HttpContextContract) {
    const organisation = await Organisation.findOrFail(params.id);
    if (auth.user) {
      await organisation.load('members');
    }

    return response.ok({
      organisation,
      status: 200,
    });
  }

  public async update({ request, response, params, auth }: HttpContextContract) {
    if (!auth.user) {
      throw new UnauthorizedException();
    }

    const data = await request.validate(OrganisationValidator);

    const organisation = await Organisation.findOrFail(params.id);
    organisation.merge(data);
    await organisation.save();

    return response.ok({
      organisation,
      status: 200,
      message: 'Updated organisation',
    });
  }

  public async destroy({ request, response, params, auth }: HttpContextContract) {
    if (!auth.user) {
      throw new UnauthorizedException();
    }

    const organisation = await Organisation.findOrFail(params.id);
    await organisation.delete();

    return response.ok({
      status: 200,
      message: 'Organisation deleted successfully',
    });
  }
}
