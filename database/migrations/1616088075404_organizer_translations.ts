import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import { Languages } from 'App/Helpers/Languages';

export default class OrganizerTranslations extends BaseSchema {
  protected tableName = 'organizer_translations';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();

      table
        .enu('language', [Languages.DE, Languages.DE_EASY, Languages.EN])
        .defaultTo(Languages.DE);

      table.integer('organizer_id').unsigned().references('organizers.id');

      table.string('name');
      table.text('description');
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
