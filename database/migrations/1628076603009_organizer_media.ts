import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class OrganizerMedia extends BaseSchema {
  protected tableName = 'organizer_media';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.timestamps(true);

      table
        .string('organizer_public_id')
        .unsigned()
        .references('organizers.public_id');
      table
        .integer('media_id')
        .unsigned()
        .references('media.id')
        .onDelete('CASCADE');
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
