import { EventsList } from '@ioc:Adonis/Core/Event';
import Env from '@ioc:Adonis/Core/Env';
import Mail from '@ioc:Adonis/Addons/Mail';

export default class OrganizerRoleListener {
  public async sendInvitationMail(
    organizerRole: EventsList['organizerRole:new']
  ) {
    const registerUrl = `${Env.get('APP_URL') as string}/auth/register`;

    try {
      await Mail.send((message) => {
        message.to(organizerRole.email);
        message.from(Env.get('FROM_EMAIL') as string);
        message.subject("You've been invited to kulturdaten.berlin");
        message.htmlView('emails/invitation', {
          url: registerUrl,
        });
      });
    } catch (e) {
      console.error(e);
    }
  }
}
