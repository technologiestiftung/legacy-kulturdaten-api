import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Organizer from 'App/Models/Organizer/Organizer';
import faker from 'faker';
import { LocationFactory } from 'Database/factories/Location';

export default class LocationSeeder extends BaseSeeder {
  public async run() {
    const organizers = faker.random.arrayElements(
      await Organizer.query().preload('translations').preload('address')
    );

    for (const organizer of organizers) {
      const factory = LocationFactory.merge({});

      for (const translation of organizer.translations) {
        factory.with('translations', 1, (translationFactory) => {
          translationFactory.merge(translation.serializeAttributes());
        });
      }

      factory.with('address', 1, (address) => {
        address.merge(organizer.address.serializeAttributes());
      });

      factory.with(
        'openingHours',
        faker.datatype.number(6),
        (openingHoursFactory) => {
          factory.with('translations', 1);
        }
      );
      factory.with('accessibility', 1);

      // if (faker.datatype.boolean()) {
      //   factory.with('media', faker.datatype.number(1), (mediaFactory) => {
      //     mediaFactory.with('translations', 1);
      //   });
      // }

      const location = await factory.create();
      await location.related('organizer').associate(organizer);
    }
  }
}
