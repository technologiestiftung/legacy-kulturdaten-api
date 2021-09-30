import { schema, rules } from '@ioc:Adonis/Core/Validator';

export const link = schema.string({}, [rules.url()]);

export const links = schema.array.optional([rules.maxLength(3)]).members(link);

export const tags = schema.array.optional([rules.minLength(1)]).members(
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
