import {
  BaseModel,
  column,
  hasMany,
  HasMany,
  beforeCreate,
  afterCreate,
} from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';
import Application from '@ioc:Adonis/Core/Application';
import Rendition, {
  RENDITION_BASE_PATH,
  RENDITION_SIZES,
} from 'App/Models/Rendition';
import Event from '@ioc:Adonis/Core/Event';
import { absoluteUrl } from 'App/Helpers/Utilities';
import sharp from 'sharp';
import Logger from '@ioc:Adonis/Core/Logger';
import { unlink, writeFile } from 'fs/promises';
import { parse, join } from 'path';

export const MEDIA_BASE_PATH = '/media/images/original';
export const MEDIA_MAX_RESOLUTION = 2048;

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

  @column({
    serialize: (value) => {
      return absoluteUrl(value);
    },
  })
  public url: string;

  @column()
  public width: number;

  @column()
  public height: number;

  @column()
  public filesize: number | null;

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

  public get path() {
    return Application.publicPath(this.url);
  }

  private sharp: sharp.Sharp | undefined;

  public async getSharpInstance() {
    if (!this.sharp) {
      try {
        this.sharp = sharp(this.path);
      } catch (e) {
        Logger.error('The media file could not be opened as an image.');
        return;
      }
    }

    return this.sharp;
  }

  private async $updateFile(sharp: sharp.Sharp) {
    const buffer = await sharp.toBuffer({ resolveWithObject: true });
    await writeFile(this.path, buffer.data);

    return buffer.info;
  }

  @beforeCreate()
  public static async normalizeSize(media: Media) {
    const sharp = await media.getSharpInstance();
    if (!sharp) {
      Logger.error(
        'Could not retrieve sharp instance. Normalizing size failed.'
      );
      return;
    }

    let metadata: sharp.Metadata | sharp.OutputInfo;
    try {
      metadata = await sharp.metadata();
    } catch (e) {
      Logger.error('Could not retrieve metadata. Normalizing size failed.');
      return;
    }

    if (
      metadata.width! > MEDIA_MAX_RESOLUTION ||
      metadata.height! > MEDIA_MAX_RESOLUTION
    ) {
      sharp.resize(MEDIA_MAX_RESOLUTION, MEDIA_MAX_RESOLUTION, {
        fit: 'inside',
      });

      metadata = await media.$updateFile(sharp);

      media.width = metadata.width;
      media.height = metadata.height;
      media.filesize = metadata.size;
    }
  }

  @beforeCreate()
  public static async determineFormat(media: Media) {
    const sharp = await media.getSharpInstance();
    if (!sharp) {
      Logger.error(
        'Could not retrieve sharp instance. Retrieving format failed.'
      );
      return;
    }

    const metadata = await sharp.metadata();
    media.format = metadata.format!;
  }

  private async $createRendition(sharp: sharp.Sharp, size, url) {
    sharp.resize({ width: size, height: size, fit: 'inside' });
    let metadata = await sharp.toFile(Application.publicPath(url));

    // During seeding metadata only contains the plain metdata,
    // during runtime this is an {data, info} object
    if (metadata.data) {
      metadata = metadata.data;
    }

    return {
      url,
      width: metadata.width,
      height: metadata.height,
      filesize: metadata.size,
      format: metadata.format,
    };
  }

  @afterCreate()
  public static async createRenditions(media: Media) {
    const sharp = await media.getSharpInstance();
    if (!sharp) {
      Logger.error(
        'Could not retrieve sharp instance. Creating renditions failed.'
      );
      return;
    }

    let metadata;
    try {
      metadata = await sharp.metadata();
    } catch (e) {
      Logger.error('Could not retrieve metadata. Creating renditions failed.');
      return;
    }

    const path = parse(media.path);
    const renditions: any[] = [];

    for (const size of RENDITION_SIZES) {
      if (metadata.width! > size) {
        const url = join(
          RENDITION_BASE_PATH,
          `${path.name}-${size}w${path.ext}`
        );

        renditions.push(
          await media.$createRendition(sharp?.clone(), size, url)
        );
      }
    }

    if (renditions.length) {
      await media.related('renditions').createMany(renditions);
    }
  }
}
