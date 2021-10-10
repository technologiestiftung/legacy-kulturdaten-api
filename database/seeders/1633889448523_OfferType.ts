import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import OfferType from 'App/Models/Offer/OfferType';

import offerTypeData from '../../seeds/OfferType';

export default class OfferTypeSeeder extends BaseSeeder {
  public async run() {
    const offerTypes = await Promise.all(
      offerTypeData.map(async (offerTypeData) => {
        const offerType = new OfferType();
        await offerType.save();

        await offerType.related('translations').createMany([
          { language: 'en', name: offerTypeData.en },
          { language: 'de', name: offerTypeData.de },
        ]);

        for (const offerSubjectData of offerTypeData.subjects) {
          const offerSubject = await offerType.related('subjects').create({});
          await offerSubject.related('translations').createMany([
            { language: 'en', name: offerSubjectData.en },
            { language: 'de', name: offerSubjectData.de },
          ]);
        }

        await offerType.save();
        return offerType;
      })
    );
  }
}
