import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class OrganizerContacts extends BaseSchema {
  protected tableName = 'organizer_contacts';

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('address_id')
        .defaultTo(null)
        .unsigned()
        .references('addresses.id')
        .onDelete('SET NULL');
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('address_id');
    });
  }
}
