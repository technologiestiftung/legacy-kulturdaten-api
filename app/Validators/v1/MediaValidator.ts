import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';

export class UpdateMediaValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    attributes: schema.object().members({
      copyright: schema.string.optional({ trim: true }),
      license: schema.string.optional({ trim: true }),
      expiresAt: schema.date.optional(),
    }),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}

export class DeleteMediaValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    attributes: schema.object.optional().members({
      id: schema.string({}, [
        rules.exists({
          table: 'media',
          column: 'id',
        }),
      ]),
    }),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}
