import { DateTime } from 'luxon';
import {
  BaseModel,
  column,
  hasMany,
  HasMany,
  belongsTo,
  BelongsTo,
} from '@ioc:Adonis/Lucid/Orm';
import Organizer from 'App/Models/Organizer/Organizer';

export class OfferContributorTranslation extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @column()
  public language: string;

  @column()
  public name: string;

  @column({ serializeAs: null })
  public offerContributorId: number;
}

export default class OfferContributor extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @column({ serializeAs: null })
  public offerId: number;

  @column({ serializeAs: null })
  public organizerId: string;

  @belongsTo(() => Organizer, { localKey: 'publicId' })
  public organizer: BelongsTo<typeof Organizer>;

  @hasMany(() => OfferContributorTranslation)
  public translations: HasMany<typeof OfferContributorTranslation>;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime;

  specific() {
    if (this.organizerId && this.organizer) {
      return this.organizer;
    }
  }
}
