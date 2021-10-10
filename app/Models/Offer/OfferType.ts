import { DateTime } from 'luxon';
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import OfferSubject from 'App/Models/Offer/OfferSubject';

export class OfferTypeTranslation extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @column()
  public language: string;

  @column()
  public name: string;

  @column({ serializeAs: null })
  public offerTypeId: number;
}

export default class OfferType extends BaseModel {
  public static async findByTranslation(name) {
    return (
      await OfferType.query().whereHas('translations', (translations) => {
        translations.where('name', name);
      })
    )[0];
  }

  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @hasMany(() => OfferSubject)
  public subjects: HasMany<typeof OfferSubject>;

  @hasMany(() => OfferTypeTranslation)
  public translations: HasMany<typeof OfferTypeTranslation>;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime;
}
