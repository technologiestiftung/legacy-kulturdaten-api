import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import OrganisationValidator from 'App/Validators/v1/Private/OrganisationValidator';
import Organisation from 'App/Models/Organisation';

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
    const data = await request.validate(OrganisationValidator);
    const organisation = await Organisation.create(data);

    await organisation.related('members').save(auth.user);

    return response.ok({
      organisation,
      status: 200,
      message: 'Organisation created successfully',
    });
  }

  public async show({ request, response, params }: HttpContextContract) {
    const organisation = await Organisation.findOrFail(params.id);
    await organisation.load('members');

    return response.ok({
      organisation,
      status: 200,
    });
  }

  public async update({ request, response, params }: HttpContextContract) {
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

  public async destroy({ request, response, params }: HttpContextContract) {
    const organisation = await Organisation.findOrFail(params.id);
    await organisation.delete();

    return response.ok({
      status: 200,
      message: 'Organisation deleted successfully',
    });
  }
}
