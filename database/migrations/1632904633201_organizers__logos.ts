import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Organizers extends BaseSchema {
  protected tableName = 'organizers';

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('logo_id').unsigned().references('media.id');
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
