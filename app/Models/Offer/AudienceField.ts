import { DateTime } from 'luxon';
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import Audience from 'App/Models/Offer/Audience';

export enum FieldType {
  BOOLEAN = 'boolean',
  STRING = 'string',
  NUMBER = 'number',
  OBJECT = 'object',
}

export default class AudienceField extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @column({ serializeAs: null })
  public audienceId: number;

  @belongsTo(() => Audience)
  public audience: BelongsTo<typeof Audience>;

  @column()
  public type: FieldType;

  @column()
  public key: string;

  @column()
  public value: string;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime;
}
