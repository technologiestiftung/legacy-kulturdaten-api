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
  public static selfAssignPrimaryKey = true;

  @column({ isPrimary: true, serializeAs: null })
  public cid: string;

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

  @manyToMany(() => User, {
    relatedKey: 'id',
    localKey: 'cid',
    pivotForeignKey: 'organizer_cid',
    pivotRelatedForeignKey: 'user_id',
  })
  public members: ManyToMany<typeof User>;

  @beforeCreate()
  public static async setPrimaryKey(organizer: Organizer) {
    if (organizer.cid) {
      return;
    }

    organizer.cid = cuid();
  }
}
