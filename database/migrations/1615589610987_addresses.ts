import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Addresses extends BaseSchema {
  protected tableName = 'addresses'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamps(true)

      table.string('street').unique().notNullable()
      table.string('city').unique().notNullable()
      table.string('zipCode').unique().notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
