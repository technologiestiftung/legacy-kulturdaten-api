import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import { OfferStatus } from 'App/Models/Offer';

export default class Offers extends BaseSchema {
  protected tableName = 'offers';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.string('public_id').notNullable().unique();

      table
        .enu('status', [OfferStatus.DRAFT, OfferStatus.PUBLISHED])
        .defaultTo(OfferStatus.DRAFT);
      table.string('recurrence_rule');

      table.integer('organizer_id').unsigned().references('organizers.id');
      table.integer('location_id').unsigned().references('locations.id');

      table.timestamps(true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}