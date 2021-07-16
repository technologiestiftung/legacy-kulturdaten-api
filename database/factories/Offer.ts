import Factory from '@ioc:Adonis/Lucid/Factory';
import Offer, { OfferTranslation, OfferStatus } from 'App/Models/Offer';
import OfferDate, { OfferDateTranslation } from 'App/Models/OfferDate';
import { LinkFactory } from './Link';
import { DateTime } from 'luxon';
import { RRule, Frequency } from 'rrule';

export const OfferFactory = Factory.define(Offer, ({ faker }) => {
  const createdAt = faker.date.recent(120).toISOString();
  const updatedAt = faker.date.between(createdAt, new Date()).toISOString();

  const startsAt = faker.date.recent(120);
  startsAt.setHours(20);
  startsAt.setMinutes(15);

  let recurrenceRule;
  if (faker.datatype.boolean()) {
    recurrenceRule = new RRule({
      freq: Frequency.DAILY,
      dtstart: startsAt,
      byweekday: faker.random.arrayElements([
        RRule.MO,
        RRule.TU,
        RRule.WE,
        RRule.TH,
        RRule.FR,
        RRule.SA,
        RRule.SU,
      ]),
    });
  }

  return {
    createdAt: DateTime.fromISO(createdAt),
    updatedAt: DateTime.fromISO(updatedAt),
    recurrenceRule: recurrenceRule || undefined,
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
      };
    }).build()
  )
  .relation('dates', () =>
    Factory.define(OfferDate, ({ faker }) => {
      faker.locale = 'de';

      return {
        startsAt: DateTime.fromISO(faker.date.soon().toISOString()),
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
          };
        }).build()
      )
      .build()
  )
  .relation('links', () => LinkFactory)

  .build();
