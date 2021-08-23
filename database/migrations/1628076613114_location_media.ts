import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class LocationMedia extends BaseSchema {
  protected tableName = 'location_media';

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
