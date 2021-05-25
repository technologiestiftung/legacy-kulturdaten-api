import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class OrganizerSubjects extends BaseSchema {
  protected tableName = 'organizer_subjects';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.timestamps(true);

      table.string('name');
      table
        .integer('organizer_type_id')
        .unsigned()
        .references('organizer_types.id')
        .onDelete('CASCADE');
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
