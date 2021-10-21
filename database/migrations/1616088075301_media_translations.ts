import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import { Languages } from 'App/Helpers/Languages';

export default class MediaTranslations extends BaseSchema {
  protected tableName = 'media_translations';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();

      table
        .enu('language', [Languages.DE, Languages.DE_EASY, Languages.EN])
        .defaultTo(Languages.DE);

      table.integer('media_id').unsigned().references('media.id');

      table.text('alternative_text').notNullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
