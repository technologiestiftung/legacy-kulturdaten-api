import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import OrganisationValidator from 'App/Validators/v1/Private/OrganisationValidator';
import Organisation from 'App/Models/Organisation';

export default class OrganisationController {
  public async index({ request, response }: HttpContextContract) {
    const organisations = await Organisation.all();

    return response.ok({
      organisations,
      status: 200,
    });
  }

  public async show({ request, response, params }: HttpContextContract) {
    const organisation = await Organisation.findOrFail(params.id);

    return response.ok({
      organisation,
      status: 200,
    });
  }
}
