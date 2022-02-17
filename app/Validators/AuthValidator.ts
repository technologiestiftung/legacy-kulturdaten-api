import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { UserStatus } from 'App/Models/User';

export class LoginValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ escape: true, trim: true }, [
      rules.email({
        sanitize: false,
      }),
      rules.exists({
        table: 'users',
        column: 'email',
        where: {
          status: UserStatus.ACTIVE,
        },
      }),
    ]),

    password: schema.string({ trim: true }),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}

export class CreateUserValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ escape: true, trim: true }, [
      rules.email({
        sanitize: false,
      }),
      rules.unique({ table: 'users', column: 'email' }),
    ]),

    password: schema.string({ trim: true }, [
      rules.confirmed('passwordConfirmation'),
    ]),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}

export class RequestPasswordResetValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ escape: true, trim: true }, [
      rules.email({
        sanitize: false,
      }),
      rules.exists({
        table: 'users',
        column: 'email',
        where: {
          status: UserStatus.ACTIVE,
        },
      }),
    ]),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}

export class PasswordResetValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ escape: true, trim: true }, [
      rules.email({
        sanitize: false,
      }),
      rules.exists({
        table: 'users',
        column: 'email',
        where: {
          status: UserStatus.INACTIVE,
        },
      }),
    ]),
    password: schema.string({ trim: true }, [
      rules.confirmed('passwordConfirmation'),
    ]),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}
