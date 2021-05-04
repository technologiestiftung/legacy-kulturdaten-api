import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';

export default class OrganizerValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }),

    street1: schema.string({ trim: true }),
    street2: schema.string.optional({ trim: true }),
    zipCode: schema.string({ trim: true }),
    city: schema.string({ trim: true }),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}
