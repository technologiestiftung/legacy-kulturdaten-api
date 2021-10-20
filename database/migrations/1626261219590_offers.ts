import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import { OfferStatus } from 'App/Models/Offer/Offer';

export default class Offers extends BaseSchema {
  protected tableName = 'offers';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.string('public_id').notNullable().unique();

      table
        .enu('status', [OfferStatus.DRAFT, OfferStatus.PUBLISHED])
        .defaultTo(OfferStatus.DRAFT);

      table.boolean('has_fee');
      table.boolean('needs_registration');
      table.boolean('is_permanent');
      table.string('ticket_url');
      table.string('registration_url');

      table.string('location_id').unsigned().references('locations.public_id');

      table.timestamps(true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
