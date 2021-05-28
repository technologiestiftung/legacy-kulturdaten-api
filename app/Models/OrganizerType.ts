import { DateTime } from 'luxon';
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import OrganizerSubject from 'App/Models/OrganizerSubject';

export class OrganizerTypeTranslation extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @column()
  public language: string;

  @column()
  public name: string;

  @column()
  public description: string;

  @column({ serializeAs: null })
  public organizerTypeId: number;
}

export default class OrganizerType extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @hasMany(() => OrganizerSubject)
  public subjects: HasMany<typeof OrganizerSubject>;

  @hasMany(() => OrganizerTypeTranslation)
  public translations: HasMany<typeof OrganizerTypeTranslation>;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime;
}
