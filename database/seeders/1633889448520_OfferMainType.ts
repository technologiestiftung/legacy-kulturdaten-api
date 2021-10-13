import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import OfferType from 'App/Models/Offer/OfferType';

import offerMainTypeData from '../../seeds/OfferMainType';

export default class OfferTypeSeeder extends BaseSeeder {
  public async run() {
    await Promise.all(
      offerMainTypeData.map(async (offerMainTypeData) => {
        const offerMainType = new OfferType();
        await offerMainType.save();

        await offerMainType.related('translations').createMany([
          { language: 'en', name: offerMainTypeData.en },
          { language: 'de', name: offerMainTypeData.de },
        ]);

        await offerMainType.save();
        return offerMainType;
      })
    );
  }
}
