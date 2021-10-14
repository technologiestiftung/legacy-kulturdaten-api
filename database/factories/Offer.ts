import Factory from '@ioc:Adonis/Lucid/Factory';
import Offer, { OfferTranslation, OfferStatus } from 'App/Models/Offer/Offer';
import OfferDate, { OfferDateTranslation } from 'App/Models/Offer/OfferDate';
import { LinkFactory } from './Link';
import { DateTime } from 'luxon';
import { MediaFactory } from './Media';

export const OfferFactory = Factory.define(Offer, ({ faker }) => {
  const createdAt = faker.date.recent(120).toISOString();
  const updatedAt = faker.date.between(createdAt, new Date()).toISOString();

  return {
    createdAt: DateTime.fromISO(createdAt),
    updatedAt: DateTime.fromISO(updatedAt),
    needsRegistration: faker.datatype.boolean(),
    hasFee: faker.datatype.boolean(),
    isPermanent: faker.datatype.boolean(),
    ticketUrl: faker.internet.url(),
    status: faker.random.arrayElement([
      OfferStatus.DRAFT,
      OfferStatus.PUBLISHED,
    ]),
  };
})
  .state('draft', (offer, { faker }) => {
    offer.status = OfferStatus.DRAFT;
  })
  .state('published', (offer, { faker }) => {
    offer.status = OfferStatus.PUBLISHED;
  })
  .relation('translations', () =>
    Factory.define(OfferTranslation, ({ faker }) => {
      faker.locale = 'de';

      return {
        name: faker.company.companyName(),
        description: faker.datatype.boolean()
          ? faker.lorem.paragraph()
          : undefined,
        roomDescription: faker.datatype.boolean()
          ? faker.lorem.paragraph()
          : undefined,
      };
    }).build()
  )
  .relation('dates', () =>
    Factory.define(OfferDate, ({ faker }) => {
      faker.locale = 'de';

      const startsAt = faker.date.soon(120);
      startsAt.setHours(faker.random.arrayElement([10, 11, 15, 18, 20, 21]));
      startsAt.setMinutes(faker.random.arrayElement([0, 15, 30, 45]));

      const endsAt = DateTime.fromJSDate(startsAt)
        .toUTC()
        .setZone('local', { keepLocalTime: true })
        .plus({ minutes: faker.random.arrayElement([30, 60, 120, 1440]) });

      return {
        needsRegistration: faker.datatype.boolean(),
        hasFee: faker.datatype.boolean(),
        ticketUrl: faker.internet.url(),
        startsAt: DateTime.fromISO(startsAt.toISOString()),
        endsAt,
      };
    })
      .relation('translations', () =>
        Factory.define(OfferDateTranslation, ({ faker }) => {
          faker.locale = 'de';

          return {
            name: faker.company.companyName(),
            description: faker.datatype.boolean()
              ? faker.lorem.paragraph()
              : undefined,
            roomDescription: faker.datatype.boolean()
              ? faker.lorem.paragraph()
              : undefined,
          };
        }).build()
      )
      .build()
  )
  .relation('links', () => LinkFactory)
  .relation('media', () => MediaFactory)

  .build();
