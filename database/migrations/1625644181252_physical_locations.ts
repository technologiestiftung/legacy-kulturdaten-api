import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class PhysicalLocations extends BaseSchema {
  protected tableName = 'physical_locations';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();

      table.integer('location_id').unsigned().references('locations.id');

      table.integer('address_id').unsigned().references('addresses.id');
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
