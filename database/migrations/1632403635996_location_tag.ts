import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class LocationTags extends BaseSchema {
  protected tableName = 'location_tag';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.timestamps(true);

      table
        .string('location_id')
        .unsigned()
        .references('locations.public_id')
        .onDelete('CASCADE');
      table
        .string('tag_id')
        .unsigned()
        .references('tags.id')
        .onDelete('CASCADE');
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
