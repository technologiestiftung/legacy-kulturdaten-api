import faker from 'faker';
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import { OrganizerFactory } from 'Database/factories/Organizer';
import { OrganizerStatus } from 'App/Models/Organizer/Organizer';
import OrganizerType from 'App/Models/Organizer/OrganizerType';
import Tag from 'App/Models/Tag';

import museumsData from '../../seeds/Organizer/museums';
import theatersData from '../../seeds/Organizer/theaters';

export default class OrganizerSeeder extends BaseSeeder {
  public static developmentOnly = true;

  private async $create(resource, type: OrganizerType) {
    const factory = OrganizerFactory.merge(resource.attributes);

    for (const translation of resource.relations.translations) {
      factory.with('translations', 1, (translationFactory) => {
        translationFactory.merge(translation);
      });
    }

    factory.with('address', 1, (address) => {
      address.merge(resource.relations.address);
    });

    if (faker.datatype.boolean()) {
      factory.with('links', faker.datatype.number(3));
    }

    factory.with('contacts', faker.datatype.number(3), (contacts) => {
      contacts.with('translations', 1);
    });

    // if (faker.datatype.boolean()) {
    //   factory.with('media', faker.datatype.number(1), (mediaFactory) => {
    //     mediaFactory.with('translations', 1);
    //   });
    // }

    const organizer = await factory.create();
    if (type) {
      await organizer.related('types').attach([type.id]);

      await type.load('subjects');
      await organizer.related('subjects').attach(
        faker.random
          .arrayElements(type.subjects, faker.datatype.number(3))
          .map((subject) => {
            return subject.id;
          })
      );

      await organizer.save();
    }

    return organizer;
  }

  public async run() {
    const organizerTypeMuseum = await OrganizerType.findByTranslation('museum');
    const museums = await Promise.all(
      museumsData.map((resource) => {
        return this.$create(resource, organizerTypeMuseum);
      })
    );

    const organizerTypeTheater = await OrganizerType.findByTranslation(
      'theatre / performance venue or organization'
    );
    const theaters = await Promise.all(
      theatersData.map((resource) => {
        return this.$create(resource, organizerTypeTheater);
      })
    );

    const tags = await Tag.all();
    for (const organizer of [museums, theaters].flat()) {
      // Randomly mark some organizers as published
      if (faker.datatype.boolean()) {
        organizer.status = OrganizerStatus.PUBLISHED;
      }

      await organizer.related('tags').attach(
        faker.random
          .arrayElements(tags, faker.datatype.number(3))
          .map((tag) => {
            return tag.id;
          })
      );

      await organizer.save();
    }
  }
}
