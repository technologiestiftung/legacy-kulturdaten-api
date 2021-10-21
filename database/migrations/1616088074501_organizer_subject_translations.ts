import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import { Languages } from 'App/Helpers/Languages';

export default class OrganizerSubjectTranslations extends BaseSchema {
  protected tableName = 'organizer_subject_translations';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table
        .enu('language', [Languages.DE, Languages.DE_EASY, Languages.EN])
        .defaultTo(Languages.DE);

      table.string('name');
      table.string('description');

      table
        .integer('organizer_subject_id')
        .unsigned()
        .references('organizer_subjects.id')
        .onDelete('CASCADE');
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
