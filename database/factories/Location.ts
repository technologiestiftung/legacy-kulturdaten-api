import Factory from '@ioc:Adonis/Lucid/Factory';
import Location from 'App/Models/Location/Location';
import {
  LocationType,
  LocationStatus,
  LocationTranslation,
  OpeningHours,
  Accessibility,
} from 'App/Models/Location';
import { AddressFactory } from './Address';
import { LinkFactory } from './Link';
import { DateTime } from 'luxon';
import { MediaFactory } from './Media';

export const LocationFactory = Factory.define(Location, ({ faker }) => {
  const createdAt = faker.date.recent(120).toISOString();
  const updatedAt = faker.date.between(createdAt, new Date()).toISOString();

  return {
    status: faker.random.arrayElement([
      LocationStatus.DRAFT,
      LocationStatus.PUBLISHED,
    ]),
    type: faker.random.arrayElement([
      LocationType.VIRTUAL,
      LocationType.PHYSICAL,
    ]),
    url: faker.internet.url(),
    rentUrl: faker.internet.url(),
    createdAt: DateTime.fromISO(createdAt),
    updatedAt: DateTime.fromISO(updatedAt),
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
        openingHours: faker.datatype.boolean()
          ? faker.lorem.paragraph()
          : undefined,
      };
    }).build()
  )

  .relation('address', () => AddressFactory)
  .relation('accessibility', () =>
    Factory.define(Accessibility, ({ faker }) => {
      return {};
    }).build()
  )
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
