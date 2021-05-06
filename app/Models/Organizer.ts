import { DateTime } from 'luxon';
import {
  BaseModel,
  column,
  manyToMany,
  ManyToMany,
  belongsTo,
  BelongsTo,
  beforeCreate,
} from '@ioc:Adonis/Lucid/Orm';
import User from 'App/Models/User';
import { cuid } from '@ioc:Adonis/Core/Helpers';
import Address from 'App/Models/Address';

export default class Organizer extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @column()
  public uid: string;

  @column()
  public name: string;

  @column({ serializeAs: null })
  public addressId: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => Address)
  public address: BelongsTo<typeof Address>;

  @manyToMany(() => User)
  public members: ManyToMany<typeof User>;

  @beforeCreate()
  public static async setUniqueId(organizer: Organizer) {
    if (organizer.uid) {
      return;
    }

    organizer.uid = cuid();
  }
}
