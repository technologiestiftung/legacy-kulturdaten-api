import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';

export class CreateAppTokenValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    attributes: schema.object().members({
      name: schema.string({ trim: true }, [
        rules.unique({
          table: 'app_tokens',
          column: 'name',
          where: {
            user_id: this.context.auth?.user?.id,
          },
        }),
      ]),
      description: schema.string.optional({ trim: true }, []),
    }),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}

export class DeleteAppTokenValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    id: schema.number([
      rules.exists({
        table: 'app_tokens',
        column: 'id',
        where: {
          user_id: this.context.auth?.user?.id,
        },
      }),
    ]),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}
