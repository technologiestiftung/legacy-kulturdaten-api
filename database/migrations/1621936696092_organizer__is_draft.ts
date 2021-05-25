import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Organizer extends BaseSchema {
  protected tableName = 'organizers';

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.boolean('is_draft');
    });
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('is_draft');
    });
  }
}
