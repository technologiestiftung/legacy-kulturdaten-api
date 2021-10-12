import Factory from '@ioc:Adonis/Lucid/Factory';
import OrganizerType, {
  OrganizerTypeTranslation,
} from 'App/Models/Organizer/OrganizerType';

export const OrganizerTypeFactory = Factory.define(
  OrganizerType,
  ({ faker }) => {
    return {};
  }
)
  .relation('translations', () =>
    Factory.define(OrganizerTypeTranslation, ({ faker }) => {
      faker.locale = 'de';

      return {
        name: faker.lorem.word(),
      };
    }).build()
  )
  .build();
