import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import { TagFactory } from 'Database/factories/Tag';

export default class TagSeeder extends BaseSeeder {
  public async run() {
    await TagFactory.with('translations', 1).createMany(20);
  }
}
