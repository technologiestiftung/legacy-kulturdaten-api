import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import MediaLicense from 'App/Models/MediaLicense';

import licenses from '../../seeds/MediaLicenses';

export default class MediaLicensesSeeder extends BaseSeeder {
  public async run() {
    const mediaLicenses = await Promise.all(
      licenses.map(async (resource) => {
        return await MediaLicense.create(resource);
      })
    );
  }
}
