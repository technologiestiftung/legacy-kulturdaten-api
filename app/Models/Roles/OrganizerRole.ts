import { DateTime } from 'luxon';
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import User from 'App/Models/User';
import Organizer from 'App/Models/Organizer/Organizer';

export default class OrganizerRole extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @column()
  public role: string;

  @column({ serializeAs: null })
  public organizerId: string;

  @belongsTo(() => Organizer)
  public organizer: BelongsTo<typeof Organizer>;

  @column({ serializeAs: null })
  public userId: number;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
