import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Organizers extends BaseSchema {
  protected tableName = 'organizers';

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.string('homepage');
      table.string('email');
      table.string('phone');
    });
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumns('homepage', 'email', 'phone');
    });
  }
}
