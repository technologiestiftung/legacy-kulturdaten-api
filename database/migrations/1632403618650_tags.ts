import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Tags extends BaseSchema {
  protected tableName = 'tags';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.timestamps(true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
