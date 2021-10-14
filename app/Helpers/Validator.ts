import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { allowedLanguages } from 'Config/app';

export const link = schema.string({}, [rules.url()]);

export const links = schema.array.optional([rules.maxLength(3)]).members(link);

export const tags = schema.array.optional().members(
  schema.number([
    rules.exists({
      table: 'tags',
      column: 'id',
    }),
  ])
);

export const media = schema.array.optional().members(
  schema.file.optional({
    size: '10mb',
    extnames: ['jpg', 'gif', 'png', 'webp'],
  })
);

export const initialTranslation = schema.array
  .optional([rules.minLength(1)])
  .members(
    schema.object().members({
      attributes: schema.object().members({
        name: schema.string(),
        language: schema.enum(allowedLanguages),
      }),
    })
  );

export const address = {
  create: schema.object.optional().members({
    attributes: schema.object().members({
      street1: schema.string({ trim: true }),
      street2: schema.string.optional({ trim: true }),
      zipCode: schema.string({ trim: true }),
      city: schema.string({ trim: true }),
    }),
  }),
  update: schema.object.optional().members({
    attributes: schema.object().members({
      street1: schema.string.optional({ trim: true }),
      street2: schema.string.optional({ trim: true }),
      zipCode: schema.string.optional({ trim: true }),
      city: schema.string.optional({ trim: true }),
    }),
  }),
  publish: schema.object().members({
    attributes: schema.object().members({
      street1: schema.string({ trim: true }),
      street2: schema.string.optional({ trim: true }),
      zipCode: schema.string({ trim: true }),
      city: schema.string({ trim: true }),
    }),
  }),
};
