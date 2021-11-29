import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class AppTokens extends BaseSchema {
  protected tableName = 'app_tokens';

  public async up() {
    if (await this.schema.hasTable(this.tableName)) {
      return;
    }

    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table.string('name');
      table.string('description');
      table.string('type').notNullable();
      table.string('token', 64).notNullable();

      /**
       * "useTz: true" utilizes timezone option in PostgreSQL and MSSQL
       */
      table.timestamp('expires_at', { useTz: true }).nullable();
      table.timestamp('created_at', { useTz: true }).notNullable();
    });
  }

  public async down() {}
}
