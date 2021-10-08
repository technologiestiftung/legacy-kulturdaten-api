import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import { Roles } from 'App/Helpers/Roles';

export default class LocationRoles extends BaseSchema {
  protected tableName = 'location_roles';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table.integer('user_id').unsigned().references('users.id');
      table.integer('location_id').unsigned().references('locations.id');
      table.enu('role', [Roles.OWNER, Roles.EDITOR]).defaultTo(Roles.EDITOR);

      table.timestamps(true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
