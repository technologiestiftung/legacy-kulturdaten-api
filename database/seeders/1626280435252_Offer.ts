import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Offer from 'App/Models/Offer/Offer';
import Organizer from 'App/Models/Organizer/Organizer';
import OrganizerType from 'App/Models/Organizer/OrganizerType';
import faker from 'faker';
import { OfferFactory } from 'Database/factories/Offer';

import plays from '../../seeds/Offer/plays';
import exhibitions from '../../seeds/Offer/exhibitions';

export default class OfferSeeder extends BaseSeeder {
  public async run() {
    const theaters = faker.random.arrayElements(
      await Organizer.findByType(
        await OrganizerType.findByTranslation(
          'theatre / performance venue or organization'
        )
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
            dateFactory.with('translations', 1, (translationFactory) => {
              translationFactory.merge({
                name: `Premiere: ${play}`,
              });
            });
          });
        }

        // if (faker.datatype.boolean()) {
        //   factory.with('media', faker.datatype.number(1), (mediaFactory) => {
        //     mediaFactory.with('translations', 1);
        //   });
        // }

        factory.with('contributors', 2, (contributorFactory) => {
          if (faker.datatype.boolean()) {
            contributorFactory.with('translations', 1);
          } else {
            contributorFactory.merge({
              organizerId: faker.random.arrayElement(theaters).publicId,
            });
          }
        });

        const offer = await factory.create();
        await offer.related('organizers').sync([theater.publicId]);
      }
    }

    const museums = faker.random.arrayElements(
      await Organizer.findByType(
        await OrganizerType.findByTranslation('museum')
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
            dateFactory.with('translations', 1, (translationFactory) => {
              translationFactory.merge({
                name: `Vernissage: ${exhibition}`,
              });
            });
          });
        }

        // if (faker.datatype.boolean()) {
        //   factory.with('media', faker.datatype.number(3), (mediaFactory) => {
        //     mediaFactory.with('translations', 1);
        //   });
        // }

        factory.with('contributors', 2, (contributorFactory) => {
          if (faker.datatype.boolean()) {
            contributorFactory.with('translations', 1);
          } else {
            contributorFactory.merge({
              organizerId: faker.random.arrayElement(museums).publicId,
            });
          }
        });

        const offer = await factory.create();
        await offer.related('organizers').sync([museum.publicId]);
      }
    }
  }
}
