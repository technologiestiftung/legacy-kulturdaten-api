import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class OrganisationUser extends BaseSchema {
  protected tableName = 'organisation_user';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table.integer('user_id');
      table.integer('organisation_id');
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
