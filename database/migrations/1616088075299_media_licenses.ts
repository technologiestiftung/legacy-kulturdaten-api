import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class MediaLicenses extends BaseSchema {
  protected tableName = 'media_licenses';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table.string('name');
      table.string('url');

      table.timestamps(true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
