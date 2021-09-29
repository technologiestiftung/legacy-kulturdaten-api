import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class OrganizerTags extends BaseSchema {
  protected tableName = 'organizer_tag';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.timestamps(true);

      table
        .integer('organizer_id')
        .unsigned()
        .references('organizers.id')
        .onDelete('CASCADE');
      table
        .integer('tag_id')
        .unsigned()
        .references('tags.id')
        .onDelete('CASCADE');
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
