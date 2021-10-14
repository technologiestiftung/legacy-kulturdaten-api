import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class OfferOfferTypes extends BaseSchema {
  protected tableName = 'offer_organizer';

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
        .string('organizer_id')
        .unsigned()
        .references('organizers.public_id')
        .onDelete('CASCADE');
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
