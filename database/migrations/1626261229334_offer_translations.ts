import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import { Languages } from 'App/Helpers/Languages';

export default class OfferTranslations extends BaseSchema {
  protected tableName = 'offer_translations';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();

      table
        .enu('language', [Languages.DE, Languages.EN])
        .defaultTo(Languages.DE);

      table.integer('offer_id').unsigned().references('offers.id');

      table.string('name');
      table.text('description');
      table.text('room_description');
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
