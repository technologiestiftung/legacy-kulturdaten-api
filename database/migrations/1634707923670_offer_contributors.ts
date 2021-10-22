import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class OfferContributors extends BaseSchema {
  protected tableName = 'offer_contributors';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table.integer('offer_id').unsigned().references('offers.id');
      table
        .string('organizer_id')
        .unsigned()
        .references('organizers.public_id')
        .onDelete('CASCADE');

      table.timestamps(true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
