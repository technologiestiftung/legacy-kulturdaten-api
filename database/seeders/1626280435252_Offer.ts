import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Offer from 'App/Models/Offer';
import Organizer from 'App/Models/Organizer';
import OrganizerType from 'App/Models/OrganizerType';
import faker from 'faker';
import { OfferFactory } from 'Database/factories/Offer';

import plays from '../../seeds/Offer/plays';
import exhibitions from '../../seeds/Offer/exhibitions';

export default class OfferSeeder extends BaseSeeder {
  public async run() {
    const theaters = faker.random.arrayElements(
      await Organizer.findByType(
        await OrganizerType.findByTranslation('Theatre, dance & performance')
      )
    );

    for (const theater of theaters) {
      for (const play of faker.random.arrayElements(
        plays,
        faker.datatype.number(3)
      )) {
        const factory = OfferFactory.merge({});
        factory.with('translations', 1, (translationFactory) => {
          translationFactory.merge({
            name: play,
          });
        });

        // Some plays may celebrate a premiere
        if (faker.datatype.boolean()) {
          factory.with('dates', 1, (dateFactory) => {
            dateFactory.merge({ isManual: true });
            dateFactory.with('translations', 1, (translationFactory) => {
              translationFactory.merge({
                name: `Premiere: ${play}`,
              });
            });
          });
        }

        const offer = await factory.create();
        await offer.related('organizer').associate(theater);
      }
    }

    const museums = faker.random.arrayElements(
      await Organizer.findByType(
        await OrganizerType.findByTranslation('Museum')
      )
    );

    for (const museum of museums) {
      for (const exhibition of faker.random.arrayElements(
        exhibitions,
        faker.datatype.number(3)
      )) {
        const factory = OfferFactory.merge({});
        factory.with('translations', 1, (translationFactory) => {
          translationFactory.merge({
            name: exhibition,
          });
        });

        // Some exhibitions may celebrate a vernissage
        if (faker.datatype.boolean()) {
          factory.with('dates', 1, (dateFactory) => {
            dateFactory.merge({ isManual: true });
            dateFactory.with('translations', 1, (translationFactory) => {
              translationFactory.merge({
                name: `Vernissage: ${exhibition}`,
              });
            });
          });
        }

        const offer = await factory.create();
        await offer.related('organizer').associate(museum);
      }
    }
  }
}