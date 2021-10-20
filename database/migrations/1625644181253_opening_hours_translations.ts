import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import { Languages } from 'App/Helpers/Languages';

export default class OpeningHoursTranslations extends BaseSchema {
  protected tableName = 'opening_hours_translations';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();

      table
        .enu('language', [Languages.DE, Languages.EN])
        .defaultTo(Languages.DE);

      table
        .integer('opening_hours_id')
        .unsigned()
        .references('opening_hourss.id');

      table.text('additional_info');
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
