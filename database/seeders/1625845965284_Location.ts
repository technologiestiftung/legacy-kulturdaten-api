import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Location from 'App/Models/Location';
import Organizer from 'App/Models/Organizer';
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

      const location = await factory.create();
      console.log('Created', { location });
    }
  }
}
