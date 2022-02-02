import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { allowedLanguages } from 'Config/app';

export const links = {
  create: schema.array
    .optional([rules.maxLength(3)])
    .members(schema.string({}, [rules.url()])),
  publish: schema.array.optional([rules.maxLength(3)]).members(
    schema.object().members({
      attributes: schema.object().members({
        url: schema.string({}, [rules.url()]),
      }),
    })
  ),
};

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

export const initialTranslation = schema.array.optional().members(
  schema.object().members({
    attributes: schema.object().members({
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
      district: schema.string.optional({ trim: true }),
      city: schema.string({ trim: true }),
    }),
  }),
  update: schema.object.optional().members({
    attributes: schema.object().members({
      street1: schema.string.optional({ trim: true }),
      street2: schema.string.optional({ trim: true }),
      zipCode: schema.string.optional({ trim: true }),
      district: schema.string.optional({ trim: true }),
      city: schema.string.optional({ trim: true }),
    }),
  }),
  publish: schema.object().members({
    attributes: schema.object().members({
      street1: schema.string({ trim: true }),
      street2: schema.string.optional({ trim: true }),
      zipCode: schema.string({ trim: true }),
      district: schema.string.optional({ trim: true }),
      city: schema.string({ trim: true }),
    }),
  }),
};
