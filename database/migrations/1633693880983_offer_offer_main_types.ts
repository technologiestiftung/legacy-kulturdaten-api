import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class OfferOfferTypes extends BaseSchema {
  protected tableName = 'offer_offer_main_type';

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
        .integer('offer_main_type_id')
        .unsigned()
        .references('offer_main_types.id')
        .onDelete('CASCADE');
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
