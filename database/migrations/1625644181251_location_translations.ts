import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import { Languages } from 'App/Helpers/Languages';

export default class LocationTranslation extends BaseSchema {
  protected tableName = 'location_translations';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();

      table
        .enu('language', [Languages.DE, Languages.DE_EASY, Languages.EN])
        .defaultTo(Languages.DE);

      table
        .integer('location_id')
        .unsigned()
        .references('locations.id')
        .onDelete('CASCADE');

      table.string('name');
      table.text('description');
      table.text('opening_hours');
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
