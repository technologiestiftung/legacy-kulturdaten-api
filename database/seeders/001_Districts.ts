import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import District from 'App/Models/District';

import districts from '../../seeds/Districts';

export default class DistrictsSeeder extends BaseSeeder {
  public async run() {
    const uniqueKey = 'name';

    await District.updateOrCreateMany(uniqueKey, districts);
  }
}
