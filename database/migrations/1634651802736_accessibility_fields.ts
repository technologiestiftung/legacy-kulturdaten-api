import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import { FieldType } from 'App/Models/Location/AccessibilityField';

export default class AccessibilityFields extends BaseSchema {
  protected tableName = 'accessibility_fields';

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
        .integer('accessibility_id')
        .unsigned()
        .references('accessibilities.id')
        .onDelete('CASCADE');

      table.timestamps(true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
