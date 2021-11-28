import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import { OfferDateStatus } from 'App/Models/Offer/OfferDate';

export default class OfferDates extends BaseSchema {
  protected tableName = 'offer_dates';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table
        .enu('status', [
          OfferDateStatus.SCHEDULED,
          OfferDateStatus.CANCELED,
          OfferDateStatus.PAST,
        ])
        .defaultTo(OfferDateStatus.SCHEDULED);

      table.dateTime('starts_at', { useTz: true });
      table.dateTime('ends_at', { useTz: true });
      table.boolean('has_breaks');
      table.boolean('needs_registration');
      table.string('ticket_url');
      table.string('registration_url');
      table.string('location_url');

      table
        .integer('offer_id')
        .unsigned()
        .references('offers.id')
        .onDelete('CASCADE');
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
