import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class OpeningHours extends BaseSchema {
  protected tableName = 'opening_hours';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table.string('weekday');
      table.string('from');
      table.string('to');
      table
        .integer('location_id')
        .unsigned()
        .references('locations.id')
        .onDelete('CASCADE');

      table.timestamps(true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
