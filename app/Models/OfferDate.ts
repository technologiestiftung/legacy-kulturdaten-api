import { DateTime } from 'luxon';
import {
  BaseModel,
  column,
  manyToMany,
  ManyToMany,
  hasMany,
  HasMany,
  belongsTo,
  BelongsTo,
  beforeCreate,
} from '@ioc:Adonis/Lucid/Orm';

export class OfferDateTranslation extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @column()
  public language: string;

  @column()
  public name: string;

  @column()
  public description: string;

  @column({ serializeAs: null })
  public offerDateId: number;
}

export default class OfferDate extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @column.dateTime()
  public startsAt: DateTime;

  @column()
  public isManual: boolean;

  @hasMany(() => OfferDateTranslation)
  public translations: HasMany<typeof OfferDateTranslation>;

  @column({ serializeAs: null })
  public offerId: number;
}
