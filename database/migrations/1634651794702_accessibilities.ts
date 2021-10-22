import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Accessibilities extends BaseSchema {
  protected tableName = 'accessibilities';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table
        .string('location_id')
        .unsigned()
        .references('locations.public_id')
        .onDelete('CASCADE');

      table.timestamps(true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
