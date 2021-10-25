import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Services extends BaseSchema {
  protected tableName = 'services';

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
