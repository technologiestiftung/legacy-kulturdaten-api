import faker from 'faker';
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Organizer from 'App/Models/Organizer/Organizer';
import Location from 'App/Models/Location/Location';
import { LocationFactory } from 'Database/factories/Location';

export default class LocationSeeder extends BaseSeeder {
  public static developmentOnly = true;

  public async run() {
    const existingLocations = await Location.all();
    if (existingLocations.length) {
      return;
    }

    const organizers = faker.random.arrayElements(
      await Organizer.query().preload('translations')
    );

    for (const organizer of organizers) {
      const factory = LocationFactory.merge({});

      for (const translation of organizer.translations) {
        factory.with('translations', 1, (translationFactory) => {
          translationFactory.merge(translation.serializeAttributes());
        });
      }

      factory.with('address', 1);

      factory.with('openingHours', faker.datatype.number(6));
      factory.with('accessibility', 1);
      factory.with('service', 1);

      const location = await factory.create();
      await location.related('organizer').associate(organizer);
    }
  }
}
