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
    }),
    relations: schema.object.optional().members({
      address: schema.object().members({
        attributes: schema.object().members({
          street1: schema.string({ trim: true }),
          street2: schema.string.optional({ trim: true }),
          zipCode: schema.string({ trim: true }),
          city: schema.string({ trim: true }),
        }),
      }),
      type: schema.number.optional([
        rules.requiredIfExists('/relations.subjects'),
        rules.exists({
          table: 'organizer_types',
          column: 'id',
        }),
      ]),
      subjects: schema.array.optional([rules.minLength(1)]).members(
        schema.number([
          rules.exists({
            table: 'organizer_subjects',
            column: 'id',
            where: { organizer_type_id: this.refs.organizerTypeId },
          }),
        ])
      ),
    }),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}

export class UpdateOrganizerValidator {
  constructor(
    private context: HttpContextContract,
    private organizer: Organizer
  ) {}

  public refs = schema.refs({
    organizerTypeId:
      this.context.request.input('relations')?.type?.id ||
      this.organizer.organizerTypeId,
  });

  public schema = schema.create({
    attributes: schema.object.optional().members({
      name: schema.string.optional({ trim: true }),
      description: schema.string.optional({ trim: true }),
      status: schema.enum.optional(Object.values(OrganizerStatus)),
    }),
    relations: schema.object.optional().members({
      address: schema.object().members({
        attributes: schema.object().members({
          street1: schema.string.optional({ trim: true }),
          street2: schema.string.optional({ trim: true }),
          zipCode: schema.string.optional({ trim: true }),
          city: schema.string.optional({ trim: true }),
        }),
      }),
      type: schema.number.optional([
        rules.exists({
          table: 'organizer_types',
          column: 'id',
        }),
      ]),
      subjects: schema.array.optional([rules.minLength(1)]).members(
        schema.number([
          rules.exists({
            table: 'organizer_subjects',
            column: 'id',
            where: { organizer_type_id: this.refs.organizerTypeId },
          }),
        ])
      ),
    }),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}

export class PublishOrganizerValidator {
  constructor(private organizer: Organizer) {}

  public refs = schema.refs({
    organizerTypeId: this.organizer.organizerTypeId,
  });

  public schema = schema.create({
    attributes: schema.object().members({
      name: schema.string({ trim: true }),
      description: schema.string({ trim: true }),
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
      type: schema.number([
        rules.exists({
          table: 'organizer_types',
          column: 'id',
        }),
      ]),
      subjects: schema.array([rules.minLength(1)]).members(
        schema.number([
          rules.exists({
            table: 'organizer_subjects',
            column: 'id',
            where: { organizer_type_id: this.refs.organizerTypeId },
          }),
        ])
      ),
    }),
  });

  public messages = {};
}
