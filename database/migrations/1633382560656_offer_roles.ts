import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import { Roles } from 'App/Helpers/Roles';

export default class OfferRoles extends BaseSchema {
  protected tableName = 'offer_roles';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table.integer('user_id').unsigned().references('users.id');
      table.integer('offer_id').unsigned().references('offers.id');
      table.enu('role', [Roles.OWNER, Roles.EDITOR]).defaultTo(Roles.EDITOR);

      table.timestamps(true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
