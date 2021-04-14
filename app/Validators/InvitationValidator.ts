import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';

export default class InvitationValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ escape: true, trim: true }, [
      rules.email({
        sanitize: true,
      }),
    ]),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}
