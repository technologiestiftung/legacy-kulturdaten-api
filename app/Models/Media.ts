import {
  BaseModel,
  column,
  hasMany,
  HasMany,
  afterCreate,
} from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';
import Application from '@ioc:Adonis/Core/Application';
import Rendition from 'App/Models/Rendition';
import Event from '@ioc:Adonis/Core/Event';

export const MEDIA_BASE_PATH = '/media/images/original';

export class MediaTranslation extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @column()
  public language: string;

  @column()
  public alternativeText: string;

  @column({ serializeAs: null })
  public mediaId: number;
}

export default class Media extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @column()
  public url: string;

  public get path() {
    return Application.publicPath(this.url);
  }

  @column()
  public width: number;

  @column()
  public height: number;

  @column()
  public filesize: number;

  @column()
  public format: string;

  @column()
  public copyright: string;

  @column()
  public license: string;

  @hasMany(() => Rendition)
  public renditions: HasMany<typeof Rendition>;

  @hasMany(() => MediaTranslation)
  public translations: HasMany<typeof MediaTranslation>;

  @column.dateTime()
  public expiresAt: DateTime;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime;

  @afterCreate()
  public static async triggerNewMedia(media: Media) {
    Event.emit('media:create', media);
  }
}
