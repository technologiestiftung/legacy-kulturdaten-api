import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import { UserStatus } from 'App/Models/User';

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.string('email', 255).notNullable();
      table.string('password', 180).notNullable();
      table.string('remember_me_token').nullable();
      table
        .enu('status', [UserStatus.ACTIVE, UserStatus.INACTIVE])
        .defaultTo(UserStatus.INACTIVE);
      table.timestamps(true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
