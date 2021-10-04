import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema } from '@ioc:Adonis/Core/Validator';
import { allowedLanguages } from 'Config/app';

export const translation = schema.object().members({
  alternativeText: schema.string.optional({ trim: true }),
  language: schema.enum(allowedLanguages),
});
