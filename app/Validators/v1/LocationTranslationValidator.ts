import { schema } from '@ioc:Adonis/Core/Validator';
import { allowedLanguages } from 'Config/app';

export const translation = schema.object().members({
  name: schema.string.optional({ trim: true }),
  description: schema.string.optional({ trim: true }),
  language: schema.enum(allowedLanguages),
});

export class PublishLocationTranslationValidator {
  public schema = schema.create({
    attributes: schema.object().members({
      name: schema.string({ trim: true }),
      description: schema.string({ trim: true }),
      language: schema.enum(allowedLanguages),
    }),
  });

  public messages = {};
}
