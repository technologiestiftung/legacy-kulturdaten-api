import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import { Languages } from 'App/Helpers/Languages';

export default class TagTranslations extends BaseSchema {
  protected tableName = 'tag_translations';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table
        .enu('language', [Languages.DE, Languages.EN])
        .defaultTo(Languages.DE);

      table.string('name');

      table
        .integer('tag_id')
        .unsigned()
        .references('tags.id')
        .onDelete('CASCADE');
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
