import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';

export class UpdateServiceValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    relations: schema.object.optional().members({
      fields: schema.array.optional().members(
        schema.object.optional().members({
          attributes: schema.object().members({
            type: schema.string.optional({ trim: true }),
            key: schema.string.optional({ trim: true }),
            value: schema.string.optional({ trim: true }),
          }),
        })
      ),
    }),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}

export class DeleteServiceValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    attributes: schema.object.optional().members({
      id: schema.string({}, [
        rules.exists({
          table: 'locations',
          column: 'public_id',
        }),
      ]),
    }),
    relations: schema.object.optional().members({
      fields: schema.array.optional().members(
        schema.number([
          rules.exists({
            table: 'service_fields',
            column: 'id',
          }),
        ])
      ),
    }),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}
