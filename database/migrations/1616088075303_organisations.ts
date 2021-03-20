import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Organisations extends BaseSchema {
  protected tableName = 'organisations';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.timestamps(true);

      table.string('name').notNullable();
      table.string('description');

      table.string('street_1');
      table.string('street_2');
      table.string('city');
      table.string('zip_code');
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
