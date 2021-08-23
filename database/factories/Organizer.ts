import Factory from '@ioc:Adonis/Lucid/Factory';
import Organizer, {
  OrganizerTranslation,
  OrganizerStatus,
} from 'App/Models/Organizer';
import { AddressFactory } from './Address';
import { OrganizerTypeFactory } from './OrganizerType';
import { LinkFactory } from './Link';
import { MediaFactory } from './Media';
import { DateTime } from 'luxon';

export const OrganizerFactory = Factory.define(Organizer, ({ faker }) => {
  const createdAt = faker.date.recent(120).toISOString();
  const updatedAt = faker.date.between(createdAt, new Date()).toISOString();

  return {
    createdAt: DateTime.fromISO(createdAt),
    updatedAt: DateTime.fromISO(updatedAt),
    status: faker.random.arrayElement([
      OrganizerStatus.DRAFT,
      OrganizerStatus.PUBLISHED,
    ]),
  };
})
  .state('draft', (organizer, { faker }) => {
    organizer.status = OrganizerStatus.DRAFT;
  })
  .state('published', (organizer, { faker }) => {
    organizer.status = OrganizerStatus.PUBLISHED;
  })
  .relation('translations', () =>
    Factory.define(OrganizerTranslation, ({ faker }) => {
      faker.locale = 'de';

      return {
        name: faker.company.companyName(),
        description: faker.datatype.boolean()
          ? faker.lorem.paragraph()
          : undefined,
      };
    }).build()
  )
  .relation('address', () => AddressFactory)
  .relation('types', () => OrganizerTypeFactory)
  .relation('links', () => LinkFactory)
  .relation('media', () => MediaFactory)

  .build();
