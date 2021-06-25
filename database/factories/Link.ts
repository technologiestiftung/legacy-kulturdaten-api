import Factory from '@ioc:Adonis/Lucid/Factory';
import Link from 'App/Models/Link';

export const LinkFactory = Factory.define(Link, ({ faker }) => {
  return {
    url: faker.internet.url(),
  };
}).build();
