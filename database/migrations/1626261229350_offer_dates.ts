import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class OfferDates extends BaseSchema {
  protected tableName = 'offer_dates';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table.boolean('is_manual');
      table.dateTime('starts_at', { useTz: true });

      table.integer('offer_id').unsigned().references('offers.id');
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
