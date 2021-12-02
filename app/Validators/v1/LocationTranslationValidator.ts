import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { allowedLanguages } from 'Config/app';

export const translation = schema.object().members({
  name: schema.string.optional({ trim: true }, [rules.maxLength(100)]),
  description: schema.string.optional({ trim: true }, [rules.description()]),
  openingHours: schema.string.optional({ trim: true }),
  language: schema.enum(allowedLanguages),
});

export class PublishLocationTranslationValidator {
  public schema = schema.create({
    attributes: schema.object().members({
      name: schema.string({ trim: true }, [rules.maxLength(100)]),
      description: schema.string.optional({ trim: true }, [
        rules.description(),
      ]),
      openingHours: schema.string.optional({ trim: true }),
      language: schema.enum(allowedLanguages),
    }),
  });

  public messages = {};
}
