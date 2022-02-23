import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Organizers extends BaseSchema {
  protected tableName = 'organizers';

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('address_id');
      table
        .integer('main_contact_id')
        .unsigned()
        .references('organizer_contacts.id')
        .onDelete('SET NULL');
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('main_contact_id');
    });
  }
}
