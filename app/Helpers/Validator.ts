import { schema, rules } from '@ioc:Adonis/Core/Validator';

export const links = schema.array
  .optional([rules.maxLength(3)])
  .members(schema.string({}, [rules.url()]));

export const tags = schema.array.optional([rules.minLength(1)]).members(
  schema.number([
    rules.exists({
      table: 'tags',
      column: 'id',
    }),
  ])
);
