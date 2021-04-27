import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { UnauthorizedException } from 'App/Exceptions/Auth';
import InvitationValidator from 'App/Validators/InvitationValidator';
import Invitation from 'App/Models/Invitation';
import { InvalidRouteSignature } from 'App/Exceptions/InvalidRouteSignature';
import Event from '@ioc:Adonis/Core/Event';
import { ApiDocument } from 'App/Helpers/Api';

export default class InvitationController {
  public async index({ response, auth }: HttpContextContract) {
    if (!auth.user) {
      throw new UnauthorizedException();
    }

    const invitations = await Invitation.all();
    return new ApiDocument(response, { data: invitations });
  }

  public async store({ request, response, auth }: HttpContextContract) {
    if (!auth.user) {
      throw new UnauthorizedException();
    }

    const { email } = await request.validate(InvitationValidator);
    const invitation = new Invitation();
    invitation.email = email;
    await invitation.related('user').associate(auth.user);

    Event.emit('new:invitation', invitation);

    return new ApiDocument(
      response,
      { data: invitation },
      'Successfully issued invitation.'
    );
  }

  public async destroy({ response, params, auth }: HttpContextContract) {
    if (!auth.user) {
      throw new UnauthorizedException();
    }

    const invitation = await Invitation.findOrFail(params.id);
    await invitation.delete();

    return new ApiDocument(response, {}, 'Deleted invitation.');
  }
}
