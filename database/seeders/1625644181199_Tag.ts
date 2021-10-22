import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Tag from 'App/Models/Tag';

import tagData from '../../seeds/Tag';

export default class TagSeeder extends BaseSeeder {
  public async run() {
    const tag = await Promise.all(
      tagData.map(async (resource) => {
        const tag = new Tag();
        tag.fill(resource.attributes);
        await tag.save();

        await tag
          .related('translations')
          .createMany(resource.relations.translations);

        await tag.save();
        return tag;
      })
    );
  }
}
