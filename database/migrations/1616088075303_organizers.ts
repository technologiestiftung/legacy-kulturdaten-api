import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import { Languages } from 'App/Helpers/Languages';

export default class Organizers extends BaseSchema {
  protected tableName = 'organizers';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.string('public_id').notNullable().unique();

      table
        .enu('language', [Languages.DE, Languages.EN])
        .defaultTo(Languages.DE);

      table.boolean('is_draft');

      table.integer('address_id').unsigned().references('addresses.id');
      table
        .integer('organizer_type_id')
        .unsigned()
        .references('organizer_types.id');

      table.timestamps(true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
