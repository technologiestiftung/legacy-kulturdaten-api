import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import OfferMainType from 'App/Models/Offer/OfferMainType';

import offerMainTypes from '../../seeds/OfferMainType';

export default class OfferMainTypeSeeder extends BaseSeeder {
  public async run() {
    await Promise.all(
      offerMainTypes.map(async (resource) => {
        const offerMainType = new OfferMainType();
        await offerMainType.save();

        await offerMainType.related('translations').createMany([
          { language: 'en', name: resource.en },
          { language: 'de', name: resource.de },
        ]);

        return offerMainType;
      })
    );
  }
}
