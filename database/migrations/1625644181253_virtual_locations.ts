import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class VirtualLocations extends BaseSchema {
  protected tableName = 'virtual_locations';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();

      table.integer('location_id').unsigned().references('locations.id');

      table.string('url');
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
