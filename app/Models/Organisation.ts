import {DateTime} from 'luxon';
import {BaseModel, column, manyToMany, ManyToMany, computed} from '@ioc:Adonis/Lucid/Orm';
import User from './User';

export default class Organisation extends BaseModel {
  @column({isPrimary: true})
  public id: number;

  @column.dateTime({autoCreate: true})
  public createdAt: DateTime;

  @column.dateTime({autoCreate: true, autoUpdate: true})
  public updatedAt: DateTime;

  @column()
  public name: string;

  @column()
  public description: string;

  @column()
  public street1: string;

  @column()
  public street2: string;

  @column()
  public city: string;

  @column()
  public zipCode: string;

  @manyToMany(() => User)
  public members: ManyToMany<typeof User>;
}
