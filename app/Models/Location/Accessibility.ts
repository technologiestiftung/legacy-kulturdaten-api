import { DateTime } from 'luxon';
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm';
import AccessibilityField from 'App/Models/Location/AccessibilityField';
import Location from 'App/Models/Location/Location';

export default class Accessibility extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @column({ serializeAs: null })
  public locationId: string;

  @belongsTo(() => Location, {
    foreignKey: 'publicId',
  })
  public location: BelongsTo<typeof Location>;

  @hasMany(() => AccessibilityField)
  public fields: HasMany<typeof AccessibilityField>;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime;
}
