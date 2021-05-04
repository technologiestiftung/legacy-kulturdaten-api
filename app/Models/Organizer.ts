import { DateTime } from 'luxon';
import {
  BaseModel,
  column,
  manyToMany,
  ManyToMany,
  beforeCreate,
} from '@ioc:Adonis/Lucid/Orm';
import User from './User';
import { v4 as uuidv4 } from 'uuid';

export default class Organizer extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public uid: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @column()
  public name: string;

  @column({ columnName: 'street_1' })
  public street1: string;

  @column({ columnName: 'street_2' })
  public street2: string;

  @column()
  public city: string;

  @column()
  public zipCode: string;

  @manyToMany(() => User)
  public members: ManyToMany<typeof User>;

  @beforeCreate()
  public static async setUniqueId(organizer: Organizer) {
    organizer.uid = uuidv4();
  }
}
