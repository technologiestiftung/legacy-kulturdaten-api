import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class OfferSubjects extends BaseSchema {
  protected tableName = 'offer_subjects';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table
        .integer('offer_type_id')
        .unsigned()
        .references('offer_types.id')
        .onDelete('CASCADE');

      table.timestamps(true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
