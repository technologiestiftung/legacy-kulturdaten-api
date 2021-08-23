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
      table.string('license');
      table.dateTime('expires_at', { useTz: true });

      table.timestamps(true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
