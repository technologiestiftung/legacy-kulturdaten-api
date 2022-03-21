import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class OfferLocations extends BaseSchema {
  protected tableName = 'offer_locations';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.timestamps(true);

      table
        .integer('offer_id')
        .unsigned()
        .references('offers.id')
        .onDelete('CASCADE');
      table
        .string('location_id')
        .unsigned()
        .references('locations.public_id')
        .onDelete('CASCADE');
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
