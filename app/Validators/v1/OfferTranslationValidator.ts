import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { allowedLanguages } from 'Config/app';

export const translation = schema.object().members({
  name: schema.string.optional({ trim: true }, [rules.maxLength(100)]),
  teaser: schema.string.optional({ trim: true }, [rules.maxLength(150)]),
  description: schema.string.optional({ trim: true }, [rules.description()]),
  roomDescription: schema.string.optional({ trim: true }),
  language: schema.enum(allowedLanguages),
});

export class PublishOfferTranslationValidator {
  public schema = schema.create({
    attributes: schema.object().members({
      name: schema.string({ trim: true }, [rules.maxLength(100)]),
      teaser: schema.string.optional({ trim: true }, [rules.maxLength(150)]),
      description: schema.string({ trim: true }, [rules.description()]),
      language: schema.enum(allowedLanguages),
    }),
  });

  public messages = {};
}
