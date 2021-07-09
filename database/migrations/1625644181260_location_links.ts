import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class LocationLinks extends BaseSchema {
  protected tableName = 'location_links';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.timestamps(true);

      table
        .string('location_public_id')
        .unsigned()
        .references('locations.public_id')
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
