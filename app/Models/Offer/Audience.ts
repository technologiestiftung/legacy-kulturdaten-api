import { DateTime } from 'luxon';
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm';
import AudienceField from 'App/Models/Offer/AudienceField';
import Offer from 'App/Models/Offer/Offer';

export default class Audience extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @column({ serializeAs: null })
  public offerId: string;

  @belongsTo(() => Offer, {
    foreignKey: 'publicId',
  })
  public offer: BelongsTo<typeof Offer>;

  @hasMany(() => AudienceField)
  public fields: HasMany<typeof AudienceField>;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime;
}
