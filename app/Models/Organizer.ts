import { DateTime } from 'luxon';
import {
  BaseModel,
  column,
  manyToMany,
  ManyToMany,
  hasOne,
  HasOne,
  belongsTo,
  BelongsTo,
  beforeCreate,
} from '@ioc:Adonis/Lucid/Orm';
import User from 'App/Models/User';
import { cuid } from '@ioc:Adonis/Core/Helpers';
import Address from 'App/Models/Address';
import OrganizerType from 'App/Models/OrganizerType';
import OrganizerSubject from 'App/Models/OrganizerSubject';

export default class Organizer extends BaseModel {
  public static selfAssignPrimaryKey = true;

  @column({ isPrimary: true, serializeAs: null })
  public cid: string;

  @column()
  public name: string;

  @column({ serializeAs: null })
  public addressId: number;

  @belongsTo(() => Address)
  public address: BelongsTo<typeof Address>;

  @column({ serializeAs: null })
  public organizerTypeId: number;

  @belongsTo(() => OrganizerType)
  public type: BelongsTo<typeof OrganizerType>;

  @manyToMany(() => OrganizerSubject, {
    relatedKey: 'id',
    localKey: 'cid',
    pivotForeignKey: 'organizer_cid',
    pivotRelatedForeignKey: 'organizer_subject_id',
    pivotTable: 'organizer_organizer_subjects',
  })
  public subjects: ManyToMany<typeof OrganizerSubject>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

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
