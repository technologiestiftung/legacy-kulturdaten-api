import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Media extends BaseSchema {
  protected tableName = 'media';

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
