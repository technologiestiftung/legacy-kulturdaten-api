import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Organizer extends BaseSchema {
  protected tableName = 'organizers';

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table
        .integer('organizer_type_id')
        .unsigned()
        .references('organizer_types.id');
    });
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {});
  }
}
