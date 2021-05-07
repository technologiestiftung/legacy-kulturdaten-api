import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class OrganizerUser extends BaseSchema {
  protected tableName = 'organizer_user';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('user_id');
      table.string('organizer_cid');
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
