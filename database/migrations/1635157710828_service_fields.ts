import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import { FieldType } from 'App/Models/Location/ServiceField';

export default class ServiceFields extends BaseSchema {
  protected tableName = 'service_fields';

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
        .integer('service_id')
        .unsigned()
        .references('services.id')
        .onDelete('CASCADE');

      table.timestamps(true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
