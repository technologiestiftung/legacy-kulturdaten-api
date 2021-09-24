import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class OfferTags extends BaseSchema {
  protected tableName = 'offer_tag';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.timestamps(true);

      table
        .string('offer_id')
        .unsigned()
        .references('offers.id')
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
