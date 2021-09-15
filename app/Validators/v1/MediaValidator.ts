import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema } from '@ioc:Adonis/Core/Validator';

export class UpdateMediaValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    attributes: schema.object().members({
      copyright: schema.string({ trim: true }),
      license: schema.string.optional({ trim: true }),
      expiresAt: schema.date.optional(),
    }),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}
