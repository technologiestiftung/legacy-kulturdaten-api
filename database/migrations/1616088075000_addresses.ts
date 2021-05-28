import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Addresses extends BaseSchema {
  protected tableName = 'addresses';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table.string('street1');
      table.string('street2');
      table.string('city');
      table.string('zip_code');

      table.timestamps(true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
