import { EventsList } from '@ioc:Adonis/Core/Event';
import Env from '@ioc:Adonis/Core/Env';
import Mail from '@ioc:Adonis/Addons/Mail';
import Route from '@ioc:Adonis/Core/Route';

export default class NewUserListener {
  public async sendVerificationMail(user: EventsList['new:user']) {
    const signedUrl = Route.makeSignedUrl('user.verify', {
      email: user.email,
    });
    const verificationUrl = `${Env.get('APP_URL') as string}${signedUrl}`;

    try {
      await Mail.send((message) => {
        message.to(user.email);
        message.from(Env.get('FROM_EMAIL') as string);
        message.subject('Welcome to kulturdaten.berlin');
        message.htmlView('emails/user_verification', {
          user,
          url: verificationUrl,
        });
      });
    } catch (e) {
      console.error(e);
    }
  }
}
