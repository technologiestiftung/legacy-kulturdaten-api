import { DateTime } from 'luxon';
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import Accessibility from 'App/Models/Location/Accessibility';

export enum FieldType {
  BOOLEAN = 'boolean',
  STRING = 'string',
  NUMBER = 'number',
  OBJECT = 'object',
}

export default class AccessibilityField extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @column({ serializeAs: null })
  public accessibilityId: number;

  @belongsTo(() => Accessibility)
  public accessibility: BelongsTo<typeof Accessibility>;

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
