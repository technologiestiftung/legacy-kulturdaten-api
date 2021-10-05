import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { OfferDateStatus } from 'App/Models/OfferDate';
import { allowedLanguages } from 'Config/app';

export class CreateOfferDateValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    attributes: schema.object().members({
      startsAt: schema.date(),
      endsAt: schema.date(),
      status: schema.enum.optional(Object.values(OfferDateStatus)),
      needsRegistration: schema.boolean.optional(),
      hasFee: schema.boolean.optional(),
      ticketUrl: schema.string.optional({}, [rules.url()]),
    }),
    relations: schema.object.optional().members({
      translations: schema.array.optional([rules.minLength(1)]).members(
        schema.object().members({
          name: schema.string.optional({ trim: true }, [
            rules.requiredIfNotExistsAll(['description', 'roomDescription']),
          ]),
          description: schema.string.optional({ trim: true }, [
            rules.requiredIfNotExistsAll(['name', 'roomDescription']),
          ]),
          roomDescription: schema.string.optional({ trim: true }, [
            rules.requiredIfNotExistsAll(['description', 'name']),
          ]),
          language: schema.enum(allowedLanguages),
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
      hasFee: schema.boolean.optional(),
      ticketUrl: schema.string.optional({}, [rules.url()]),
    }),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}
