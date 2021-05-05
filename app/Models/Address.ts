import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm';

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public street1: string;

  @column()
  public street2: string;

  @column()
  public city: string;

  @column()
  public zipCode: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
