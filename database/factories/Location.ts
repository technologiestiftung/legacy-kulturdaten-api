import Factory from '@ioc:Adonis/Lucid/Factory';
import Location, {
  LocationTranslation,
  LocationStatus,
} from 'App/Models/Location';
import { AddressFactory } from './Address';
import { LinkFactory } from './Link';
import { DateTime } from 'luxon';

export const LocationFactory = Factory.define(Location, ({ faker }) => {
  const createdAt = faker.date.recent(120).toISOString();
  const updatedAt = faker.date.between(createdAt, new Date()).toISOString();

  return {
    createdAt: DateTime.fromISO(createdAt),
    updatedAt: DateTime.fromISO(updatedAt),
    status: faker.random.arrayElement([
      LocationStatus.DRAFT,
      LocationStatus.PUBLISHED,
    ]),
  };
})
  .state('draft', (location, { faker }) => {
    location.status = LocationStatus.DRAFT;
  })
  .state('published', (location, { faker }) => {
    location.status = LocationStatus.PUBLISHED;
  })
  .relation('translations', () =>
    Factory.define(LocationTranslation, ({ faker }) => {
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
  .relation('links', () => LinkFactory)

  .build();
