import {
  BaseModel,
  column,
  hasMany,
  HasMany,
  belongsTo,
  BelongsTo,
  beforeCreate,
  afterCreate,
  beforeSave,
  beforeDelete,
} from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';
import Rendition, { RENDITION_SIZES } from 'App/Models/Rendition';
import MediaLicense from 'App/Models/MediaLicense';
import sharp from 'sharp';
import Logger from '@ioc:Adonis/Core/Logger';
import { parse, join } from 'path';
import Drive from '@ioc:Adonis/Core/Drive';

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

  @column({ serializeAs: null })
  public path: string;

  @column()
  public url: string;

  @column()
  public width: number | null;

  @column()
  public height: number | null;

  @column()
  public filesize: number | null;

  @column()
  public format: string;

  @column()
  public copyright: string;

  @column({ serializeAs: null })
  public mediaLicenseId: number;

  @belongsTo(() => MediaLicense)
  public license: BelongsTo<typeof MediaLicense>;

  @hasMany(() => Rendition)
  public renditions: HasMany<typeof Rendition>;

  @hasMany(() => MediaTranslation)
  public translations: HasMany<typeof MediaTranslation>;

  @column.dateTime()
  public expiresAt: DateTime;

  @column.dateTime()
  public acceptedTermsAt: DateTime;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime;

  public renditionSizes: Array<number>;

  private sharp: sharp.Sharp | undefined;

  public async getSharpInstance() {
    if (!this.sharp) {
      try {
        const buffer = await Drive.get(this.path);
        this.sharp = sharp(buffer);
      } catch (e) {
        Logger.error('The media file could not be opened as an image.');
        return;
      }
    }

    return this.sharp;
  }

  private async $updateFile(sharp: sharp.Sharp) {
    const buffer = await sharp.toBuffer({ resolveWithObject: true });
    await Drive.put(this.path, buffer.data);

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
    }

    media.width = metadata.width || null;
    media.height = metadata.height || null;
    media.filesize = metadata.size || null;
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

  private async $createRendition(sharp: sharp.Sharp, size, fileName) {
    sharp.resize({ width: size, height: size, fit: 'inside' });

    const buffer = await sharp.toBuffer({ resolveWithObject: true });
    await Drive.put(fileName, buffer.data);

    return {
      path: fileName,
      url: await Drive.getUrl(fileName),
      base: size,
      width: buffer.info.width,
      height: buffer.info.height,
      filesize: buffer.info.size,
      format: buffer.info.format,
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

    const sizes = media.renditionSizes || RENDITION_SIZES;
    for (const size of sizes) {
      if (metadata.width! > size) {
        const fileName = join(`${path.name}-${size}w${path.ext}`);

        renditions.push(
          await media.$createRendition(sharp?.clone(), size, fileName)
        );
      }
    }

    if (renditions.length) {
      await media.related('renditions').createMany(renditions);
    }
  }

  @beforeSave()
  public static async updateUrl(media: Media) {
    if (!media.expiresAt) {
      media.url = await Drive.getUrl(media.path);
    } else {
      media.url = await Drive.getSignedUrl(media.path, {
        expiresIn: (media.expiresAt - DateTime.now()) / 1000,
      });
    }

    await media.load('renditions');
    for (const rendition of media.renditions) {
      await rendition.updateUrl(media);
    }
  }

  @beforeDelete()
  public static async removeStaleFile(media: Media) {
    await Drive.delete(media.path);
  }
}
