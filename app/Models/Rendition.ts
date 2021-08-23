import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';
import Media from 'App/Models/Media';
import Application from '@ioc:Adonis/Core/Application';
import { absoluteUrl } from 'App/Helpers/Utilities';

export const RENDITION_BASE_PATH = '/media/images/renditions/';

export default class Rendition extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @column({
    serialize: (value) => {
      return absoluteUrl(value);
    },
  })
  public url: string;

  public get path() {
    return Application.publicPath(this.url);
  }

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
