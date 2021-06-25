import faker from 'faker';
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import { OrganizerFactory } from 'Database/factories/Organizer';
import { OrganizerStatus } from 'App/Models/Organizer';
import OrganizerType from 'App/Models/OrganizerType';

import museumsData from '../../fixtures/Organizer/museums';
import theatersData from '../../fixtures/Organizer/theaters';

export default class OrganizerSeeder extends BaseSeeder {
  private async $create(resource, type) {
    const factory = OrganizerFactory.merge(resource.attributes);

    for (const translation of resource.relations.translations) {
      factory.with('translations', 1, (translationFactory) => {
        translationFactory.merge(translation);
      });
    }

    if (faker.datatype.boolean()) {
      factory.with('links', faker.datatype.number(3));
    }

    factory.with('address', 1, (address) => {
      address.merge(resource.relations.address);
    });

    const organizer = await factory.create();
    if (type) {
      await organizer.related('types').attach([type.id]);
    }

    return organizer;
  }

  public async run() {
    const organizerTypeMuseum = await OrganizerType.findByTranslation('Museum');
    const museums = await Promise.all(
      museumsData.map((resource) => {
        return this.$create(resource, organizerTypeMuseum);
      })
    );

    const organizerTypeTheater = await OrganizerType.findByTranslation(
      'Theater'
    );
    const theaters = await Promise.all(
      theatersData.map((resource) => {
        return this.$create(resource, organizerTypeTheater);
      })
    );

    for (const organizer of [museums, theaters].flat()) {
      // Randomly mark some organizers as published
      if (faker.datatype.boolean()) {
        organizer.status = OrganizerStatus.PUBLISHED;
      }

      await organizer.save();
    }
  }
}
