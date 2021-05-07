import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { UnauthorizedException } from 'App/Exceptions/Auth';
import InvitationValidator from 'App/Validators/InvitationValidator';
import Invitation from 'App/Models/Invitation';
import { InvalidRouteSignature } from 'App/Exceptions/InvalidRouteSignature';
import Event from '@ioc:Adonis/Core/Event';
import { ApiDocument } from 'App/Helpers/Api';

export default class InvitationController {
  public async index(ctx: HttpContextContract) {
    const { auth } = ctx;
    if (!auth.user) {
      throw new UnauthorizedException();
    }

    const invitations = await Invitation.all();
    return new ApiDocument(ctx, { data: invitations });
  }

  public async store(ctx: HttpContextContract) {
    const { request, auth } = ctx;
    if (!auth.user) {
      throw new UnauthorizedException();
    }

    const { email } = await request.validate(InvitationValidator);
    const invitation = new Invitation();
    invitation.email = email;
    await invitation.related('user').associate(auth.user);

    Event.emit('new:invitation', invitation);

    return new ApiDocument(
      ctx,
      { data: invitation },
      'Successfully issued invitation.'
    );
  }

  public async destroy(ctx: HttpContextContract) {
    const { auth, params } = ctx;
    if (!auth.user) {
      throw new UnauthorizedException();
    }

    const invitation = await Invitation.findOrFail(params.id);
    await invitation.delete();

    return new ApiDocument(ctx, {}, 'Deleted invitation.');
  }
}
