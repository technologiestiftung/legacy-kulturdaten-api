import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class PeakHours extends BaseSchema {
  protected tableName = 'peak_hours';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table.string('weekday');
      table.string('from');
      table.string('to');
      table
        .integer('offer_id')
        .unsigned()
        .references('offers.id')
        .onDelete('CASCADE');

      table.timestamps(true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
