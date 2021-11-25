import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import { FieldType } from 'App/Models/Offer/AudienceField';

export default class AudienceFields extends BaseSchema {
  protected tableName = 'audience_fields';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table
        .enu('type', [
          FieldType.BOOLEAN,
          FieldType.STRING,
          FieldType.NUMBER,
          FieldType.OBJECT,
        ])
        .defaultTo(FieldType.STRING);
      table.string('key');
      table.string('value');
      table
        .integer('audience_id')
        .unsigned()
        .references('audiences.id')
        .onDelete('CASCADE');

      table.timestamps(true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
