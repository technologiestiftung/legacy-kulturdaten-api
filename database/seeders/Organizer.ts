import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import { OrganizerFactory } from 'Database/factories/Organizer';

export default class OrganizerSeeder extends BaseSeeder {
  public async run() {
    await OrganizerFactory.createMany(10);
  }
}
