import Factory from '@ioc:Adonis/Lucid/Factory';
import Organisation from 'App/Models/Organisation';

export const OrganisationFactory = Factory.define(Organisation, ({ faker }) => {
  faker.locale = 'de';

  return {
    name: faker.company.companyName(),
    description: faker.commerce.productDescription(),
    street1: faker.address.streetAddress(),
    city: faker.address.city(),
    zipCode: faker.address.zipCode(),
  };
}).build();
