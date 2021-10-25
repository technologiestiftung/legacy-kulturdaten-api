import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { OfferStatus } from 'App/Models/Offer/Offer';
import { tags, links, media, initialTranslation } from 'App/Helpers/Validator';
import { allowedLanguages } from 'Config/app';
import { Weekdays } from 'App/Models/Offer/PeakHours';

export class CreateOfferValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    attributes: schema.object.optional().members({
      status: schema.enum.optional(Object.values(OfferStatus)),
      needsRegistration: schema.boolean.optional(),
      hasFee: schema.boolean.optional(),
      isPermanent: schema.boolean.optional(),
      ticketUrl: schema.string.optional({}, [rules.url()]),
      registrationUrl: schema.string.optional({}, [rules.url()]),
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
      location: schema.string.optional({}, [
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
      contributors: schema.array.optional().members(
        schema.object.optional().members({
          relations: schema.object().members({
            organizer: schema.string.optional({}, [
              rules.exists({
                table: 'organizers',
                column: 'public_id',
              }),
            ]),
            translations: schema.array.optional([rules.minLength(1)]).members(
              schema.object().members({
                attributes: schema.object().members({
                  name: schema.string({ trim: true }),
                  language: schema.enum(allowedLanguages),
                }),
              })
            ),
          }),
        })
      ),
      peakHours: schema.array.optional().members(
        schema.object().members({
          attributes: schema.object().members({
            weekday: schema.enum(Object.values(Weekdays)),
            from: schema.string({}, [rules.regex(/^\d{2}:\d{2}$/)]),
            to: schema.string({}, [rules.regex(/^\d{2}:\d{2}$/)]),
          }),
        })
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
      registrationUrl: schema.string.optional({}, [rules.url()]),
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
      contributors: schema.array.optional().members(
        schema.object.optional().members({
          id: schema.number.optional([
            rules.exists({
              table: 'offer_contributors',
              column: 'id',
            }),
          ]),
          relations: schema.object.optional().members({
            organizer: schema.string.optional({}, [
              rules.exists({
                table: 'organizers',
                column: 'public_id',
              }),
            ]),
            translations: schema.array.optional([rules.minLength(1)]).members(
              schema.object().members({
                attributes: schema.object().members({
                  name: schema.string({ trim: true }),
                  language: schema.enum(allowedLanguages),
                }),
              })
            ),
          }),
        })
      ),
      peakHours: schema.array.optional().members(
        schema.object().members({
          id: schema.number.optional([
            rules.exists({
              table: 'peak_hours',
              column: 'id',
            }),
          ]),
          attributes: schema.object().members({
            weekday: schema.enum(Object.values(Weekdays)),
            from: schema.string({}, [rules.regex(/^\d{2}:\d{2}$/)]),
            to: schema.string({}, [rules.regex(/^\d{2}:\d{2}$/)]),
          }),
        })
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

export class DeleteOfferValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    attributes: schema.object.optional().members({
      id: schema.string({}, [
        rules.exists({
          table: 'offers',
          column: 'public_id',
        }),
      ]),
    }),
    relations: schema.object.optional().members({
      dates: schema.array.optional().members(
        schema.number([
          rules.exists({
            table: 'offer_dates',
            column: 'id',
          }),
        ])
      ),
      contributors: schema.array.optional().members(
        schema.number([
          rules.exists({
            table: 'offer_contributors',
            column: 'id',
          }),
        ])
      ),
      peakHours: schema.array.optional().members(
        schema.number([
          rules.exists({
            table: 'peak_hours',
            column: 'id',
          }),
        ])
      ),
      media: schema.array.optional().members(
        schema.number([
          rules.exists({
            table: 'media',
            column: 'id',
          }),
        ])
      ),
    }),
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
      registrationUrl: schema.string.optional({}, [rules.url()]),
    }),
    relations: schema.object().members({
      links,
      mainType: schema.array([rules.minLength(1)]).members(
        schema.object().members({
          id: schema.number(),
        })
      ),
      types: schema.array([rules.minLength(1)]).members(
        schema.object().members({
          id: schema.number(),
        })
      ),
    }),
  });

  public messages = {};
}
