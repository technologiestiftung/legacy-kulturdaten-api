import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Accessibilities extends BaseSchema {
  protected tableName = 'accessibilities';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table.integer('location_id').unsigned().references('locations.public_id');

      table.timestamps(true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
