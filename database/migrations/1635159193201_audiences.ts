import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Audiences extends BaseSchema {
  protected tableName = 'audiences';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table
        .string('offer_id')
        .unsigned()
        .references('offers.public_id')
        .onDelete('CASCADE');

      table.timestamps(true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
