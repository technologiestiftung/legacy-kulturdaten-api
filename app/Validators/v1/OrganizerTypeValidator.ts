import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';

export default class OrganizerTypeValidator {
  constructor(private ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ escape: true, trim: true }, [
      rules.unique({ table: 'organizer_types', column: 'name' }),
    ]),
  });

  public cacheKey = this.ctx.routeKey;

  public messages = {};
}
