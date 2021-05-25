import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';

export default class OrganizerValidator {
  constructor(private context: HttpContextContract) {}

  public refs = schema.refs({
    organizerTypeId: this.context.request.input('type'),
  });

  public schema = schema.create({
    name: schema.string({ trim: true }),
    address: schema.object().members({
      street1: schema.string({ trim: true }),
      street2: schema.string.optional({ trim: true }),
      zipCode: schema.string({ trim: true }),
      city: schema.string({ trim: true }),
    }),
    type: schema.number.optional([
      rules.exists({
        table: 'organizer_types',
        column: 'id',
      }),
    ]),
    subjects: schema.array.optional([rules.minLength(1)]).members(
      schema.number.optional([
        rules.exists({
          table: 'organizer_subjects',
          column: 'id',
          where: { organizer_type_id: this.refs.organizerTypeId },
        }),
      ])
    ),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}
