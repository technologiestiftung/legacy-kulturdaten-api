import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class OrganizerSubjects extends BaseSchema {
  protected tableName = 'organizer_subjects';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table
        .integer('organizer_type_id')
        .unsigned()
        .references('organizer_types.id')
        .onDelete('CASCADE');

      table.timestamps(true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
