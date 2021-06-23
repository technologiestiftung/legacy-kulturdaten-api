import faker from 'faker';
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import { OrganizerFactory } from 'Database/factories/Organizer';
import { OrganizerStatus } from 'App/Models/Organizer';
import OrganizerType from 'App/Models/OrganizerType';
import OrganizerSubject from 'App/Models/OrganizerSubject';

export default class OrganizerSeeder extends BaseSeeder {
  public async run() {
    const organizers = await Promise.all([
      // Create some organizers that are only available in a single
      // language
      OrganizerFactory.with('address')
        .with('translations', 1, (translation) => {
          return translation.apply('de');
        })
        .createMany(25),

      // Create some organizers that are translated to both
      // German and English
      OrganizerFactory.with('address')
        .with('translations', 1, (translation) => {
          return translation.apply('de');
        })
        .with('translations', 1, (translation) => {
          return translation.apply('en');
        })
        .createMany(25),
    ]);

    const organizerTypes = await OrganizerType.query();
    const organizerSubjects = await OrganizerSubject.query();
    for (const organizer of organizers.flat()) {
      await organizer.related('types').sync(
        faker.random.arrayElements(organizerTypes).map((type) => {
          return type.id;
        })
      );
      await organizer.related('subjects').sync(
        faker.random.arrayElements(organizerSubjects).map((subject) => {
          return subject.id;
        })
      );

      // Randomly mark some organizers as published
      if (faker.datatype.boolean()) {
        organizer.status = OrganizerStatus.PUBLISHED;
      }

      await organizer.save();
    }
  }
}
