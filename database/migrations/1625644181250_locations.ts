import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import { LocationStatus } from 'App/Models/Location/Location';

export default class Locations extends BaseSchema {
  protected tableName = 'locations';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.string('public_id').notNullable().unique();

      table
        .enu('status', [LocationStatus.DRAFT, LocationStatus.PUBLISHED])
        .defaultTo(LocationStatus.DRAFT);

      table.integer('address_id').unsigned().references('addresses.id');
      table.string('url');

      table
        .string('organizer_id')
        .unsigned()
        .references('organizers.public_id');

      table.timestamps(true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
