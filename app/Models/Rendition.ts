import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  beforeDelete,
} from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';
import Media from 'App/Models/Media';
import Drive from '@ioc:Adonis/Core/Drive';

export const RENDITION_SIZES = [1500, 1000, 500];

export default class Rendition extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @column({ serializeAs: null })
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

  @beforeDelete()
  public static async removeStaleFile(rendition: Rendition) {
    await Drive.delete(rendition.path);
  }

  public async updateUrl(media: Media) {
    if (!media.expiresAt) {
      this.url = await Drive.getUrl(this.path);
    } else {
      this.url = await Drive.getSignedUrl(this.path, {
        expiresIn: (media.expiresAt - DateTime.now()) / 1000,
      });
    }

    await this.save();
  }
}
