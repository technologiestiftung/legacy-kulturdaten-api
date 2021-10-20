import { DateTime } from 'luxon';
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';

export enum Weekdays {
  MON = 'monday',
  TUE = 'tuesday',
  WED = 'wednesday',
  THU = 'thursday',
  FRI = 'friday',
  SAT = 'saturday',
  SUN = 'friday',
}

export class OpeningHoursTranslation extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @column()
  public language: string;

  @column()
  public additionalInfo: string;

  @column({ serializeAs: null })
  public openingHoursId: number;
}

export default class OpeningHours extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @column({ serializeAs: null })
  public locationId: number;

  @column()
  public weekday: string;

  @column()
  public from: string;

  @column()
  public to: string;

  @hasMany(() => OpeningHoursTranslation)
  public translations: HasMany<typeof OpeningHoursTranslation>;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime;
}
