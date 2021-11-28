import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';

export class UserUpdateValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    attributes: schema.object().members({
      email: schema.string.optional({ escape: true, trim: true }, [
        rules.email({
          sanitize: false,
        }),
        rules.unique({ table: 'users', column: 'email' }),
        rules.confirmed('emailConfirmation'),
      ]),
      password: schema.string.optional({ trim: true }, [
        rules.confirmed('passwordConfirmation'),
      ]),
      acceptedTermsAt: schema.date.optional(),
      deletionRequestedAt: schema.date.optional(),
    }),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}
