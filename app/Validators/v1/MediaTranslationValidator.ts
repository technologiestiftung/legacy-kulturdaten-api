import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema } from '@ioc:Adonis/Core/Validator';
import { allowedLanguages } from 'Config/app';

export class MediaTranslationValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    attributes: schema.object().members({
      alternativeText: schema.string.optional({ trim: true }),
      language: schema.enum(allowedLanguages),
    }),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}
