import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import OfferMainType from 'App/Models/Offer/OfferMainType';

import offerMainTypeData from '../../seeds/OfferMainType';

export default class OfferMainTypeSeeder extends BaseSeeder {
  public async run() {
    await Promise.all(
      offerMainTypeData.map(async (offerMainTypeData) => {
        const offerMainType = new OfferMainType();
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