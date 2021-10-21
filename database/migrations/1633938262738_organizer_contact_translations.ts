import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import { Languages } from 'App/Helpers/Languages';

export default class OrganizerContactTranslations extends BaseSchema {
  protected tableName = 'organizer_contact_translations';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table
        .enu('language', [Languages.DE, Languages.DE_EASY, Languages.EN])
        .defaultTo(Languages.DE);

      table.string('name');

      table
        .integer('organizer_contact_id')
        .unsigned()
        .references('organizer_contacts.id')
        .onDelete('CASCADE');

      table.timestamps(true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
