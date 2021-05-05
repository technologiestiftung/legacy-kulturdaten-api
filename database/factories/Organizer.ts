import Factory from '@ioc:Adonis/Lucid/Factory';
import Organizer from 'App/Models/Organizer';
import { AddressFactory } from './Address';

export const OrganizerFactory = Factory.define(Organizer, ({ faker }) => {
  faker.locale = 'de';

  return {
    name: faker.company.companyName(),
  };
})
  .relation('address', () => AddressFactory)
  .build();
