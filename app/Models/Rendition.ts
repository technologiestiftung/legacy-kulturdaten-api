import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';
import Media from 'App/Models/Media';

export const RENDITION_SIZES = [1500, 1000, 500];

export default class Rendition extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @column()
  public path: string;

  @column()
  public url: string;

  @column()
  public base: number;

  @column()
  public width: number;

  @column()
  public height: number;

  @column()
  public format: string;

  @column()
  public filesize: number | null;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime;

  @column({ serializeAs: null })
  public mediaId: number;

  @belongsTo(() => Media)
  public media: BelongsTo<typeof Media>;
}
