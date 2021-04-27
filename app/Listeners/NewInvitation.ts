import { EventsList } from '@ioc:Adonis/Core/Event';
import Env from '@ioc:Adonis/Core/Env';
import Mail from '@ioc:Adonis/Addons/Mail';
import Route from '@ioc:Adonis/Core/Route';

export default class NewInvitationListener {
  public async sendInvitationMail(invitation: EventsList['new:invitation']) {
    // TODO: Implement signed URL to accept invitation

    try {
      await Mail.send((message) => {
        message.to(invitation.email);
        message.from(Env.get('FROM_EMAIL') as string);
        message.subject("You've been invited to kulturdaten.berlin!");
        message.htmlView('emails/invitation', {
          invitation,
        });
      });
    } catch (e) {
      console.error(e);
    }
  }
}
