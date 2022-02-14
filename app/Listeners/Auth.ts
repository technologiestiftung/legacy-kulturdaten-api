import { EventsList } from '@ioc:Adonis/Core/Event';
import Env from '@ioc:Adonis/Core/Env';
import Mail from '@ioc:Adonis/Addons/Mail';
import Route from '@ioc:Adonis/Core/Route';

export default class AuthListener {
  public async sendPasswordResetInstructions(
    email: EventsList['auth:requestPasswordReset']
  ) {
    const signedUrl = Route.makeSignedUrl(
      'user.resetPassword',
      {
        email,
      },
      {
        expiresIn: '10min',
      }
    );
    const verificationUrl = `${Env.get('APP_URL') as string}${signedUrl}`;

    try {
      await Mail.send((message) => {
        message.to(email);
        message.from(Env.get('FROM_EMAIL') as string);
        message.subject('kulturdaten.berlin: Reset your password');
        message.htmlView('emails/password_reset_requested', {
          url: verificationUrl,
        });
      });
    } catch (e) {
      console.error(e);
    }
  }

  public async sendPasswordResetNotification(
    user: EventsList['auth:passwordReset']
  ) {
    try {
      await Mail.send((message) => {
        message.to(user.email);
        message.from(Env.get('FROM_EMAIL') as string);
        message.subject('kulturdaten.berlin: Your password has been reset');
        message.htmlView('emails/password_reset', {});
      });
    } catch (e) {
      console.error(e);
    }
  }
}
