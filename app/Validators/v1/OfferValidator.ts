import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { OfferStatus } from 'App/Models/Offer/Offer';
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
      translations: initialTranslation,
      links,
      tags,
      organizers: schema.array().members(
        schema.string({}, [
          rules.exists({
            table: 'organizers',
            column: 'public_id',
          }),
        ])
      ),
      location: schema.string({}, [
        rules.exists({
          table: 'locations',
          column: 'public_id',
        }),
      ]),
      mainType: schema.array.optional().members(
        schema.number([
          rules.exists({
            table: 'offer_main_types',
            column: 'id',
          }),
        ])
      ),
      types: schema.array.optional().members(
        schema.number([
          rules.exists({
            table: 'offer_types',
            column: 'id',
          }),
        ])
      ),
      subjects: schema.array.optional().members(
        schema.number([
          rules.exists({
            table: 'offer_subjects',
            column: 'id',
          }),
        ])
      ),
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
      location: schema.string.optional({}, [
        rules.exists({
          table: 'locations',
          column: 'public_id',
        }),
      ]),
      organizers: schema.array.optional().members(
        schema.string({}, [
          rules.exists({
            table: 'organizers',
            column: 'public_id',
          }),
        ])
      ),
      mainType: schema.array.optional().members(
        schema.number([
          rules.exists({
            table: 'offer_main_types',
            column: 'id',
          }),
        ])
      ),
      types: schema.array.optional().members(
        schema.number([
          rules.exists({
            table: 'offer_types',
            column: 'id',
          }),
        ])
      ),
      subjects: schema.array.optional().members(
        schema.number([
          rules.exists({
            table: 'offer_subjects',
            column: 'id',
          }),
        ])
      ),
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
    }),
  });

  public messages = {};
}
