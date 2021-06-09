import faker from 'faker';
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import { OrganizerFactory } from 'Database/factories/Organizer';
import OrganizerType from 'App/Models/OrganizerType';
import { OrganizerStatus } from 'App/Models/Organizer';

export default class OrganizerSeeder extends BaseSeeder {
  public async run() {
    const organizers = await Promise.all([
      // Create some organizers that are only available in a single
      // language
      OrganizerFactory.with('address')
        .with('translations', 1, (translation) => {
          return translation.apply('de');
        })
        .createMany(10),

      // Create some organizers that are translated to both
      // German and English
      OrganizerFactory.with('address')
        .with('translations', 1, (translation) => {
          return translation.apply('de');
        })
        .with('translations', 1, (translation) => {
          return translation.apply('en');
        })
        .createMany(10),
    ]);

    const organizerTypes = await OrganizerType.query().preload('subjects');
    for (const organizer of organizers.flat()) {
      const organizerType = faker.random.arrayElement(organizerTypes);
      const organizerSubjects = faker.random
        .arrayElements(organizerType.subjects)
        .map((subject) => {
          return subject.id;
        });

      await organizer.related('type').associate(organizerType);
      await organizer.related('subjects').sync(organizerSubjects);

      // Randomly mark some organizers as published
      if (faker.datatype.boolean()) {
        organizer.status = OrganizerStatus.PUBLISHED;
      }

      await organizer.save();
    }
  }
}
