import { DateTime } from 'luxon';
import {
  BaseModel,
  column,
  hasMany,
  HasMany,
  belongsTo,
  BelongsTo,
} from '@ioc:Adonis/Lucid/Orm';
import Offer from 'App/Models/Offer';

export class OfferDateTranslation extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @column()
  public language: string;

  @column()
  public name: string;

  @column()
  public description: string;

  @column()
  public roomDescription: string;

  @column({ serializeAs: null })
  public offerDateId: number;
}

export enum OfferDateStatus {
  SCHEDULED = 'scheduled',
  CANCELED = 'canceled',
  PAST = 'past',
}

export default class OfferDate extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @column.dateTime()
  public startsAt: DateTime;

  @column.dateTime()
  public endsAt: DateTime;

  @column()
  public status: string;

  @column()
  public hasFee: boolean;

  @column()
  public needsRegistration: boolean;

  @column()
  public ticketUrl: string;

  @hasMany(() => OfferDateTranslation)
  public translations: HasMany<typeof OfferDateTranslation>;

  @column({ serializeAs: null })
  public offerId: number;

  @belongsTo(() => Offer)
  public offer: BelongsTo<typeof Offer>;
}
