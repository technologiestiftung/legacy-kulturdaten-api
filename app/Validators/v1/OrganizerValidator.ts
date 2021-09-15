import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Organizer, { OrganizerStatus } from 'App/Models/Organizer';

export class CreateOrganizerValidator {
  constructor(private context: HttpContextContract) {}

  public refs = schema.refs({
    organizerTypeId: this.context.request.input('relations')?.type,
  });

  public schema = schema.create({
    attributes: schema.object().members({
      name: schema.string({ trim: true }),
      description: schema.string.optional({ trim: true }),
      email: schema.string.optional({ trim: true }, [rules.email()]),
      phone: schema.string.optional({ trim: true }, [rules.mobile()]),
      homepage: schema.string.optional({ trim: true }, [rules.url()]),
      status: schema.enum.optional(Object.values(OrganizerStatus)),
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
      types: schema.array.optional([rules.minLength(1)]).members(
        schema.number([
          rules.exists({
            table: 'organizer_types',
            column: 'id',
          }),
        ])
      ),
      subjects: schema.array.optional().members(
        schema.number([
          rules.exists({
            table: 'organizer_subjects',
            column: 'id',
          }),
        ])
      ),
      links: schema.array
        .optional([rules.maxLength(3)])
        .members(schema.string({}, [rules.url()])),
    }),
    media: schema.file({
      size: '10mb',
      extnames: ['jpg', 'gif', 'png', 'webp'],
    }),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}

export class UpdateOrganizerValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    attributes: schema.object.optional().members({
      status: schema.enum.optional(Object.values(OrganizerStatus)),
      email: schema.string.optional({ trim: true }, [rules.email()]),
      phone: schema.string.optional({ trim: true }, [rules.mobile()]),
      homepage: schema.string.optional({ trim: true }, [rules.url()]),
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
      types: schema.array.optional([rules.minLength(1)]).members(
        schema.number([
          rules.exists({
            table: 'organizer_types',
            column: 'id',
          }),
        ])
      ),
      subjects: schema.array.optional().members(
        schema.number([
          rules.exists({
            table: 'organizer_subjects',
            column: 'id',
          }),
        ])
      ),
      links: schema.array
        .optional([rules.maxLength(3)])
        .members(schema.string({}, [rules.url()])),
    }),
    media: schema.file({
      size: '10mb',
      extnames: ['jpg', 'gif', 'png', 'webp'],
    }),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}

export class PublishOrganizerValidator {
  constructor(private organizer: Organizer) {}

  public schema = schema.create({
    attributes: schema.object().members({
      status: schema.enum(Object.values(OrganizerStatus)),
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
      types: schema.array([rules.minLength(1)]).members(
        schema.object().members({
          id: schema.number(),
        })
      ),
    }),
  });

  public messages = {};
}
