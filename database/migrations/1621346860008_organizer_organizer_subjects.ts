import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class OrganizerOrganizerSubjects extends BaseSchema {
  protected tableName = 'organizer_organizer_subjects';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.timestamps(true);

      table
        .string('organizer_public_id')
        .unsigned()
        .references('organizers.public_id')
        .onDelete('CASCADE');
      table
        .integer('organizer_subject_id')
        .unsigned()
        .references('organizer_subjects.id')
        .onDelete('CASCADE');
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
