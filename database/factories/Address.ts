import Factory from '@ioc:Adonis/Lucid/Factory';
import Address from 'App/Models/Address';

export const AddressFactory = Factory.define(Address, ({ faker }) => {
  faker.locale = 'de';

  const address = {
    street1: faker.address.streetAddress(),
    city: faker.address.city(),
    zipCode: faker.address.zipCode(),
  };

  if (faker.datatype.boolean()) {
    address.street2 = faker.address.streetAddress();
  }

  console.log('address', address);
  return address;
}).build();
