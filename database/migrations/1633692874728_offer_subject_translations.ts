import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import { Languages } from 'App/Helpers/Languages';

export default class OfferSubjectTranslations extends BaseSchema {
  protected tableName = 'offer_subject_translations';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table
        .enu('language', [Languages.DE, Languages.DE_EASY, Languages.EN])
        .defaultTo(Languages.DE);

      table.string('name');

      table
        .integer('offer_subject_id')
        .unsigned()
        .references('offer_subjects.id')
        .onDelete('CASCADE');
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
