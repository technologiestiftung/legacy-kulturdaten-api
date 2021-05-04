import Factory from '@ioc:Adonis/Lucid/Factory';
import Organizer from 'App/Models/Organizer';

export const OrganizerFactory = Factory.define(Organizer, ({ faker }) => {
  faker.locale = 'de';

  return {
    name: faker.company.companyName(),
    street1: faker.address.streetAddress(),
    city: faker.address.city(),
    zipCode: faker.address.zipCode(),
  };
}).build();
