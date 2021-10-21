import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Media extends BaseSchema {
  protected tableName = 'media';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table.string('url');
      table.integer('width');
      table.integer('height');
      table.bigInteger('filesize');
      table.string('format');
      table.string('copyright');
      table.dateTime('expires_at', { useTz: true });

      table
        .integer('media_license_id')
        .unsigned()
        .references('media_licenses.id')
        .onDelete('CASCADE');

      table.timestamps(true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
