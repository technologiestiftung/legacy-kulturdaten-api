import Factory from '@ioc:Adonis/Lucid/Factory';
import Location, {
  LocationStatus,
  LocationTranslation,
  VirtualLocation,
  PhysicalLocation,
} from 'App/Models/Location';
import { AddressFactory } from './Address';
import { LinkFactory } from './Link';
import { DateTime } from 'luxon';
import { MediaFactory } from './Media';

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

  .relation('physical', () =>
    Factory.define(PhysicalLocation, ({ faker }) => {
      return {};
    })
      .relation('address', () => AddressFactory)
      .build()
  )

  .relation('virtual', () =>
    Factory.define(VirtualLocation, ({ faker }) => {
      return {
        url: faker.internet.url(),
      };
    }).build()
  )

  .relation('links', () => LinkFactory)
  .relation('media', () => MediaFactory)

  .build();
