import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class OrganizerContacts extends BaseSchema {
  protected tableName = 'organizer_contacts';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table.string('phone');
      table.string('email');

      table.integer('organizer_id').unsigned().references('organizers.id');

      table.timestamps(true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
