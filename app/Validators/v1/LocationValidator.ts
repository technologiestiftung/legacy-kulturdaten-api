import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { LocationStatus } from 'App/Models/Location';

export class CreateLocationValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    attributes: schema.object().members({
      name: schema.string({ trim: true }),
      description: schema.string.optional({ trim: true }),
      status: schema.enum.optional(Object.values(LocationStatus)),
    }),
    relations: schema.object.optional().members({
      address: schema.object.optional().members({
        attributes: schema.object().members({
          street1: schema.string({ trim: true }),
          street2: schema.string.optional({ trim: true }),
          zipCode: schema.string({ trim: true }),
          city: schema.string({ trim: true }),
        }),
      }),
      links: schema.array
        .optional([rules.maxLength(3)])
        .members(schema.string({}, [rules.url()])),
    }),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}

export class UpdateLocationValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    attributes: schema.object.optional().members({
      status: schema.enum.optional(Object.values(LocationStatus)),
    }),
    relations: schema.object.optional().members({
      address: schema.object.optional().members({
        attributes: schema.object().members({
          street1: schema.string.optional({ trim: true }),
          street2: schema.string.optional({ trim: true }),
          zipCode: schema.string.optional({ trim: true }),
          city: schema.string.optional({ trim: true }),
        }),
      }),
      links: schema.array
        .optional([rules.maxLength(3)])
        .members(schema.string({}, [rules.url()])),
    }),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}

export class PublishLocationValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    attributes: schema.object().members({
      status: schema.enum(Object.values(LocationStatus)),
    }),
    relations: schema.object().members({
      address: schema.object().members({
        attributes: schema.object().members({
          street1: schema.string({ trim: true }),
          street2: schema.string.optional({ trim: true }),
          zipCode: schema.string({ trim: true }),
          city: schema.string({ trim: true }),
        }),
      }),
      links: schema.array
        .optional([rules.maxLength(3)])
        .members(schema.string({}, [rules.url()])),
    }),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}
