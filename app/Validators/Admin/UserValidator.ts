import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { UserStatus } from 'App/Models/User';

export class CreateUserValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    attributes: schema.object().members({
      email: schema.string({ escape: true, trim: true }, [
        rules.email({
          sanitize: false,
        }),
        rules.unique({ table: 'users', column: 'email' }),
      ]),
      password: schema.string({ trim: true }, []),
      status: schema.enum(Object.values(UserStatus)),
      isSuperuser: schema.boolean(),
      acceptedTermsAt: schema.date.optional(),
      deletionRequestedAt: schema.date.optional(),
    }),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}

export class UpdateUserValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    attributes: schema.object().members({
      email: schema.string.optional({ escape: true, trim: true }, [
        rules.email({
          sanitize: false,
        }),
        rules.unique({ table: 'users', column: 'email' }),
      ]),
      password: schema.string.optional({ trim: true }, []),
      status: schema.enum.optional(Object.values(UserStatus)),
      isSuperuser: schema.boolean.optional(),
      acceptedTermsAt: schema.date.optional(),
      deletionRequestedAt: schema.date.optional(),
    }),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}
