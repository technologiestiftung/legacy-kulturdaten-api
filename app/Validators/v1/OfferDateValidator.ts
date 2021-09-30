import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { OfferDateStatus } from 'App/Models/OfferDate';

export class CreateOfferDateValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    attributes: schema.object().members({
      name: schema.string({ trim: true }),
      description: schema.string.optional({ trim: true }),
      roomDescription: schema.string.optional({ trim: true }),
      startsAt: schema.date(),
      endsAt: schema.date(),
      status: schema.enum.optional(Object.values(OfferDateStatus)),
      needsRegistration: schema.boolean.optional(),
      hasFee: schema.boolean.optional(),
      ticketUrl: schema.string.optional({}, [rules.url()]),
    }),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}

export class UpdateOfferDateValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    attributes: schema.object.optional().members({
      startsAt: schema.date.optional(),
      endsAt: schema.date.optional(),
      status: schema.enum.optional(Object.values(OfferDateStatus)),
      needsRegistration: schema.boolean.optional(),
      hasFee: schema.boolean.optional(),
      ticketUrl: schema.string.optional({}, [rules.url()]),
    }),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}
