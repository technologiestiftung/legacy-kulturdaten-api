import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import OfferType from 'App/Models/Offer/OfferType';

import offerTypes from '../../seeds/OfferType';

export default class OfferTypeSeeder extends BaseSeeder {
  public async run() {
    const existingOfferTypes = await OfferType.all();
    if (existingOfferTypes.length) {
      return;
    }

    await Promise.all(
      offerTypes.map(async (resource) => {
        const offerType = new OfferType();
        await offerType.save();

        await offerType
          .related('translations')
          .createMany(resource.relations.translations);

        for (const subjectData of resource.relations.subjects) {
          const offerSubject = await offerType.related('subjects').create({});
          await offerSubject
            .related('translations')
            .createMany(subjectData.relations.translations);
        }

        return offerType;
      })
    );
  }
}
