import { DateTime } from 'luxon';
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm';
import OrganizerType from 'App/Models/Organizer/OrganizerType';

export class OrganizerSubjectTranslation extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @column()
  public language: string;

  @column()
  public name: string;

  @column()
  public description: string;

  @column({ serializeAs: null })
  public organizerSubjectId: number;
}

export default class OrganizerSubject extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @column()
  public publicId: string;

  @column({ serializeAs: null })
  public organizerTypeId: number;

  @belongsTo(() => OrganizerType)
  public type: BelongsTo<typeof OrganizerType>;

  @hasMany(() => OrganizerSubjectTranslation)
  public translations: HasMany<typeof OrganizerSubjectTranslation>;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime;
}
