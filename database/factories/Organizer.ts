import Factory from '@ioc:Adonis/Lucid/Factory';
import Organizer, { OrganizerStatus } from 'App/Models/Organizer';
import { AddressFactory } from './Address';
import { OrganizerTranslationFactory } from './OrganizerTranslation';

export const OrganizerFactory = Factory.define(Organizer, ({ faker }) => {
  return {
    status: OrganizerStatus.DRAFT,
  };
})
  .state('published', (organizer, { faker }) => {
    organizer.status = OrganizerStatus.PUBLISHED;
  })
  .relation('translations', () => OrganizerTranslationFactory)
  .relation('address', () => AddressFactory)
  .build();
