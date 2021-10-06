import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { OfferStatus } from 'App/Models/Offer';
import { tags, links, media, initialTranslation } from 'App/Helpers/Validator';

export class CreateOfferValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    attributes: schema.object.optional().members({
      status: schema.enum.optional(Object.values(OfferStatus)),
      needsRegistration: schema.boolean.optional(),
      hasFee: schema.boolean.optional(),
      isPermanent: schema.boolean.optional(),
      ticketUrl: schema.string.optional({}, [rules.url()]),
    }),
    relations: schema.object.optional().members({
      links,
      tags,
      initialTranslation,
    }),
    meta: schema.object.optional().members({
      startsAt: schema.date(),
      endsAt: schema.date(),
      recurrenceRule: schema.string({ trim: true }),
    }),
    media: media,
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}

export class UpdateOfferValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    attributes: schema.object.optional().members({
      status: schema.enum.optional(Object.values(OfferStatus)),
      needsRegistration: schema.boolean.optional(),
      hasFee: schema.boolean.optional(),
      isPermanent: schema.boolean.optional(),
      ticketUrl: schema.string.optional({}, [rules.url()]),
    }),
    relations: schema.object.optional().members({
      links,
      tags,
    }),
    meta: schema.object.optional().members({
      startsAt: schema.date(),
      endsAt: schema.date(),
      recurrenceRule: schema.string({ trim: true }),
    }),
    media: media,
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}

export class PublishOfferValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    attributes: schema.object().members({
      status: schema.enum(Object.values(OfferStatus)),
      needsRegistration: schema.boolean(),
      hasFee: schema.boolean(),
      isPermanent: schema.boolean(),
      ticketUrl: schema.string.optional({}, [rules.url()]),
    }),
    relations: schema.object().members({
      links,
      tags,
    }),
  });

  public messages = {};
}
