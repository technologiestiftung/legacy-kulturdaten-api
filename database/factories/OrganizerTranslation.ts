import Factory from '@ioc:Adonis/Lucid/Factory';
import { OrganizerTranslation } from 'App/Models/Organizer';

export const OrganizerTranslationFactory = Factory.define(
  OrganizerTranslation,
  ({ faker }) => {
    faker.locale = 'de';

    return {
      name: faker.company.companyName(),
    };
  }
)
  .state('de', (translation, { faker }) => {
    faker.locale = 'de';

    translation.language = 'de';
    translation.description = faker.company.catchPhrase();
  })
  .state('en', (translation, { faker }) => {
    faker.locale = 'en';

    translation.language = 'en';
    translation.description = faker.company.catchPhrase();
  })
  .build();
