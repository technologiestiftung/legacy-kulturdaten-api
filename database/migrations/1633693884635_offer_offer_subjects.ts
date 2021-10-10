import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class OfferOfferSubjects extends BaseSchema {
  protected tableName = 'offer_offer_subject';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.timestamps(true);

      table
        .integer('offer_id')
        .unsigned()
        .references('offers.id')
        .onDelete('CASCADE');
      table
        .integer('offer_subject_id')
        .unsigned()
        .references('offer_subject.id')
        .onDelete('CASCADE');
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
