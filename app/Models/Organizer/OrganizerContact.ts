import { DateTime } from 'luxon';
import {
  BaseModel,
  column,
  hasMany,
  HasMany,
  belongsTo,
  BelongsTo,
} from '@ioc:Adonis/Lucid/Orm';
import Address from 'App/Models/Address';

export class OrganizerContactTranslation extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @column()
  public language: string;

  @column()
  public name: string;

  @column({ serializeAs: null })
  public organizerContactId: number;
}

export default class OrganizerContact extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @hasMany(() => OrganizerContactTranslation)
  public translations: HasMany<typeof OrganizerContactTranslation>;

  @column()
  public phone: string;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public addressId: number | null;

  @belongsTo(() => Address)
  public address: BelongsTo<typeof Address>;

  @column({ serializeAs: null })
  public organizerId: number;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime;
}
