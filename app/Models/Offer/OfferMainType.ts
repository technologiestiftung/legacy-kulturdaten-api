import { DateTime } from 'luxon';
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';

export class OfferMainTypeTranslation extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public offerMainTypeId: number;

  @column()
  public language: string;

  @column()
  public name: string;

  @column({ serializeAs: null })
  public offerTypeId: number;
}

export default class OfferMainType extends BaseModel {
  public static async findByTranslation(name) {
    return (
      await OfferMainType.query().whereHas('translations', (translations) => {
        translations.where('name', name);
      })
    )[0];
  }

  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @hasMany(() => OfferMainTypeTranslation)
  public translations: HasMany<typeof OfferMainTypeTranslation>;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime;
}
