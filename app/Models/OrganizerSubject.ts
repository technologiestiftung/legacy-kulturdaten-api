import { DateTime } from 'luxon';
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import OrganizerType from 'App/Models/OrganizerType';

export default class OrganizerSubject extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @column()
  public name: string;

  @column({ serializeAs: null })
  public organizerTypeId: number;

  @belongsTo(() => OrganizerType, { foreignKey: 'organizerTypeId' })
  public type: BelongsTo<typeof OrganizerType>;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime;
}
