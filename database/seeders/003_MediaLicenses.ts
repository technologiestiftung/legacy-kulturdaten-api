import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import MediaLicense from 'App/Models/MediaLicense';

import mediaLicenses from '../../seeds/MediaLicenses';

export default class MediaLicensesSeeder extends BaseSeeder {
  public async run() {
    const uniqueKey = 'name';

    await MediaLicense.updateOrCreateMany(uniqueKey, mediaLicenses);
  }
}
