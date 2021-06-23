import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class OrganizerOrganizerSubjects extends BaseSchema {
  protected tableName = 'organizer_links';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.timestamps(true);

      table
        .string('organizer_public_id')
        .unsigned()
        .references('organizers.public_id')
        .onDelete('CASCADE');
      table
        .integer('link_id')
        .unsigned()
        .references('links.id')
        .onDelete('CASCADE');
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
