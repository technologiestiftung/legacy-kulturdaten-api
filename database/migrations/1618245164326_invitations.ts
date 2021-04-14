import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Invitations extends BaseSchema {
  protected tableName = 'invitations';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table.string('email', 255).notNullable();
      table.integer('user_id');

      table.timestamps(true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
