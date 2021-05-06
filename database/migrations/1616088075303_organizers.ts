import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Organizers extends BaseSchema {
  protected tableName = 'organizers';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.uuid('uid').unique().notNullable();
      table.integer('address_id');
      table.string('name').notNullable();

      table.timestamps(true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
