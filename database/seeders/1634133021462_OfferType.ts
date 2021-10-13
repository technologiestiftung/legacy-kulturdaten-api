import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import OfferType from 'App/Models/Offer/OfferType';
import OfferSubject from 'App/Models/Offer/OfferSubject';

import offerTypeData from '../../seeds/OfferType';

export default class OfferTypeSeeder extends BaseSeeder {
  public async run() {
    const offerTypes = await Promise.all(
      offerTypeData.map(async (resource) => {
        const offerType = new OfferType();
        await offerType.save();

        await offerType
          .related('translations')
          .createMany(resource.relations.translations);

        for (const subjectData of resource.relations.subjects) {
          const offerSubject = await offerType.related('subjects').create();
          await offerSubject
            .related('translations')
            .createMany(subjectData.relations.translations);

          await offerSubject.save();
        }

        await offerType.save();
        return offerType;
      })
    );
  }
}
