import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Superusers extends BaseSchema {
  protected tableName = 'superusers';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table
        .string('user_id')
        .unsigned()
        .references('users.id')
        .onDelete('CASCADE');
      table.timestamps(true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
