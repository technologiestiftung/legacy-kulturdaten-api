import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import { OrganisationFactory } from 'Database/factories/Organisation';

export default class OrganisationSeeder extends BaseSeeder {
  public async run() {
    await OrganisationFactory.createMany(10);
  }
}
