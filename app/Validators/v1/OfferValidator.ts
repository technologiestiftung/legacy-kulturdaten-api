import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { OfferStatus } from 'App/Models/Offer';

export class CreateOfferValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    attributes: schema.object().members({
      name: schema.string({ trim: true }),
      description: schema.string.optional({ trim: true }),
      status: schema.enum.optional(Object.values(OfferStatus)),
      recurrenceRule: schema.string.optional({ trim: true }),
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
    media: schema.array.optional().members(
      schema.file.optional({
        size: '10mb',
        extnames: ['jpg', 'gif', 'png', 'webp'],
      })
    ),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}

export class UpdateOfferValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    attributes: schema.object.optional().members({
      status: schema.enum.optional(Object.values(OfferStatus)),
      recurrenceRule: schema.string.optional({ trim: true }),
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
    media: schema.array.optional().members(
      schema.file.optional({
        size: '10mb',
        extnames: ['jpg', 'gif', 'png', 'webp'],
      })
    ),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}

export class PublishOfferValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    attributes: schema.object().members({
      status: schema.enum(Object.values(OfferStatus)),
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

  public messages = {};
}
