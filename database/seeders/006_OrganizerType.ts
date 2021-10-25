import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import OrganizerType from 'App/Models/Organizer/OrganizerType';

import organizerTypes from '../../seeds/OrganizerType';

export default class OrganizerTypeSeeder extends BaseSeeder {
  public async run() {
    await Promise.all(
      organizerTypes.map(async (resource) => {
        const organizerType = new OrganizerType();
        await organizerType.save();

        await organizerType
          .related('translations')
          .createMany(resource.relations.translations);

        for (const subjectData of resource.relations.subjects) {
          const organizerSubject = await organizerType
            .related('subjects')
            .create({});
          await organizerSubject
            .related('translations')
            .createMany(subjectData.relations.translations);
        }

        return organizerType;
      })
    );
  }
}
