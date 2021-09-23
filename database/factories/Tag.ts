import Factory from '@ioc:Adonis/Lucid/Factory';
import Tag, { TagTranslation } from 'App/Models/Tag';

export const TagFactory = Factory.define(Tag, ({ faker }) => {
  return {};
})
  .relation('translations', () =>
    Factory.define(TagTranslation, ({ faker }) => {
      faker.locale = 'de';

      return {
        name: faker.lorem.word(),
      };
    }).build()
  )
  .build();
