import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Renditions extends BaseSchema {
  protected tableName = 'renditions';

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('path');
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('path');
    });
  }
}
