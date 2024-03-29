import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { LocationStatus, LocationType } from 'App/Models/Location';
import { Weekdays } from 'App/Models/Location/OpeningHours';
import {
  tags,
  links,
  media,
  address,
  initialTranslation,
} from 'App/Helpers/Validator';

export class CreateLocationValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    attributes: schema.object.optional().members({
      type: schema.enum.optional(Object.values(LocationType)),
      status: schema.enum.optional(Object.values(LocationStatus)),
      url: schema.string.optional({}, [rules.url()]),
    }),
    relations: schema.object.optional().members({
      translations: initialTranslation,
      organizer: schema.string({}, [
        rules.exists({
          table: 'organizers',
          column: 'public_id',
        }),
      ]),
      openingHours: schema.array.optional().members(
        schema.object().members({
          attributes: schema.object().members({
            weekday: schema.enum(Object.values(Weekdays)),
            from: schema.string({}, [rules.regex(/^\d{2}:\d{2}$/)]),
            to: schema.string({}, [rules.regex(/^\d{2}:\d{2}$/)]),
          }),
        })
      ),
      address: address.create,
      tags,
      links: links.create,
    }),
    media,
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}

export class UpdateLocationValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    attributes: schema.object.optional().members({
      type: schema.enum.optional(Object.values(LocationType)),
      status: schema.enum.optional(Object.values(LocationStatus)),
      url: schema.string.optional({}, [rules.url()]),
    }),
    relations: schema.object.optional().members({
      organizer: schema.string.optional({}, [
        rules.exists({
          table: 'organizers',
          column: 'public_id',
        }),
      ]),
      openingHours: schema.array.optional().members(
        schema.object().members({
          id: schema.number.optional([
            rules.exists({
              table: 'opening_hours',
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
      address: address.update,
      tags,
      links: links.create,
    }),
    media,
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}

export class DeleteLocationValidator {
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
      openingHours: schema.array.optional().members(
        schema.number([
          rules.exists({
            table: 'opening_hours',
            column: 'id',
          }),
        ])
      ),
      address: schema.number.optional([
        rules.exists({
          table: 'address',
          column: 'id',
        }),
      ]),
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

export class PublishLocationValidator {
  public schema = schema.create({
    attributes: schema.object().members({
      status: schema.enum(Object.values(LocationStatus)),
      url: schema.string.optional({}, [rules.url()]),
    }),
    relations: schema.object().members({
      // For a location an address is not required,
      // hence reuse the create rule
      address: address.create,
      links: links.publish,
    }),
  });

  public messages = {};
}
