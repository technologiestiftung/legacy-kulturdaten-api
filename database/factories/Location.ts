import Factory from '@ioc:Adonis/Lucid/Factory';
import Location from 'App/Models/Location/Location';
import {
  LocationStatus,
  LocationTranslation,
  OpeningHours,
} from 'App/Models/Location';
import { AddressFactory } from './Address';
import { LinkFactory } from './Link';
import { DateTime } from 'luxon';
import { MediaFactory } from './Media';

export const LocationFactory = Factory.define(Location, ({ faker }) => {
  const createdAt = faker.date.recent(120).toISOString();
  const updatedAt = faker.date.between(createdAt, new Date()).toISOString();

  return {
    url: faker.internet.url(),
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
  .relation('openingHours', () =>
    Factory.define(OpeningHours, ({ faker }) => {
      const hours = [
        ['09:00', '18:00'],
        ['10:00', '16:00'],
        ['07:00', '12:30'],
        ['11:00', '14:00'],
        ['06:00', '12:00'],
        ['00:00', '23:59'],
      ];

      const [from, to] = faker.random.arrayElement(hours);
      return {
        weekday: faker.random.arrayElement([
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday',
          'sunday',
        ]),
        from,
        to,
      };
    }).build()
  )

  .relation('links', () => LinkFactory)
  .relation('media', () => MediaFactory)

  .build();
