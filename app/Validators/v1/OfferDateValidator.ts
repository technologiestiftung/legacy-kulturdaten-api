import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { OfferDateStatus } from 'App/Models/Offer/OfferDate';
import { allowedLanguages } from 'Config/app';

export class CreateOfferDateValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    attributes: schema.object().members({
      startsAt: schema.date(),
      endsAt: schema.date(),
      status: schema.enum.optional(Object.values(OfferDateStatus)),
      needsRegistration: schema.boolean.optional(),
      hasBreaks: schema.boolean.optional(),
      hasFee: schema.boolean.optional(),
      ticketUrl: schema.string.optional({}, [rules.url()]),
      registrationUrl: schema.string.optional({}, [rules.url()]),
      locationUrl: schema.string.optional({}, [rules.url()]),
    }),
    relations: schema.object.optional().members({
      translations: schema.array.optional([rules.minLength(1)]).members(
        schema.object().members({
          attributes: schema.object().members({
            name: schema.string.optional({ trim: true }, [
              rules.requiredIfNotExistsAll([
                'description',
                'roomDescription',
                'teaser',
              ]),
            ]),
            teaser: schema.string.optional({ trim: true }, [
              rules.requiredIfNotExistsAll([
                'name',
                'description',
                'roomDescription',
              ]),
            ]),
            description: schema.string.optional({ trim: true }, [
              rules.requiredIfNotExistsAll([
                'name',
                'roomDescription',
                'teaser',
              ]),
            ]),
            roomDescription: schema.string.optional({ trim: true }, [
              rules.requiredIfNotExistsAll(['description', 'name', 'teaser']),
            ]),
            language: schema.enum(allowedLanguages),
          }),
        })
      ),
    }),
    meta: schema.object.optional().members({
      recurrenceRule: schema.string({ trim: true }),
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
      hasBreaks: schema.boolean.optional(),
      hasFee: schema.boolean.optional(),
      ticketUrl: schema.string.optional({}, [rules.url()]),
      registrationUrl: schema.string.optional({}, [rules.url()]),
      locationUrl: schema.string.optional({}, [rules.url()]),
    }),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}

export class DeleteOfferDateValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    attributes: schema.object.optional().members({
      id: schema.string({}, [
        rules.exists({
          table: 'offer_dates',
          column: 'id',
        }),
      ]),
    }),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}
