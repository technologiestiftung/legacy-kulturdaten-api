import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';

export default class OrganizerSubjectValidator {
  constructor(private ctx: HttpContextContract) {}

  public typeId: number = this.ctx.params.organizer_type_id;

  public schema = schema.create({
    name: schema.string({ escape: true, trim: true }, [
      rules.unique({
        table: 'organizer_subjects',
        column: 'name',
        where: { organizer_type_id: this.typeId },
      }),
    ]),

    params: schema.object().members({
      organizer_type_id: schema.number([
        rules.exists({
          table: 'organizer_types',
          column: 'id',
        }),
      ]),
    }),
  });

  public cacheKey = `${this.ctx.routeKey}-${this.typeId}`;

  public messages = {};
}
