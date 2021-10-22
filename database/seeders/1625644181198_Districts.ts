import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import District from 'App/Models/District';

import districts from '../../seeds/Districts';

export default class DistrictsSeeder extends BaseSeeder {
  public async run() {
    await Promise.all(
      districts.map(async (resource) => {
        return await District.create(resource);
      })
    );
  }
}
