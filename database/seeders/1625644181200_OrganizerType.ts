import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import OrganizerType from 'App/Models/Organizer/OrganizerType';
import OrganizerSubject from 'App/Models/Organizer/OrganizerSubject';

import organizerTypeData from '../../seeds/OrganizerType';

export default class OrganizerTypeSeeder extends BaseSeeder {
  public async run() {
    const organizerTypes = await Promise.all(
      organizerTypeData.map(async (resource) => {
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

          await organizerSubject.save();
        }

        await organizerType.save();
        return organizerType;
      })
    );
  }
}
