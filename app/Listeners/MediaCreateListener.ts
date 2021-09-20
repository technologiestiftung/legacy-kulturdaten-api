import sharp, { Sharp } from 'sharp';
import Rendition, { RENDITION_BASE_PATH } from 'App/Models/Rendition';
import Media, { MEDIA_BASE_PATH } from 'App/Models/Media';
import { parse, join } from 'path';
import Application from '@ioc:Adonis/Core/Application';
import Logger from '@ioc:Adonis/Core/Logger';
import { unlink, writeFile } from 'fs/promises';

interface Image {
  media: Media;
  file: Sharp;
  metadata: sharp.Metadata;
}

const MEDIA_MAX_RESOLUTION = 2048;

const RENDITION_SIZES = [1500, 1000, 500];

export default class MediaCreateListener {
  public async call(media: Media) {
    let file;
    let metadata;
    try {
      file = sharp(media.path);
      metadata = await file.metadata();
    } catch (e) {
      Logger.error('The uploaded file could not be opened as an image.');
      await this.$abort(media);
      return;
    }

    const image: Image = {
      media,
      file,
      metadata,
    };

    if (!metadata.width || !metadata.height || !metadata.format) {
      Logger.warn('The processed file is not an image.');
      await this.$abort(media);
      return;
    }

    image.media.width = metadata.width;
    image.media.height = metadata.height;
    image.media.filesize = metadata.size || image.media.filesize || null;

    try {
      await this.$normalizeSize(image);
    } catch (e) {
      Logger.error('Could not normalize size of image.');
      Logger.error(e);
    }

    try {
      await this.$createRenditions(image);
    } catch (e) {
      Logger.error('Could not create renditions for image.');
      Logger.error(e);
    }

    try {
      await image.media.save();
    } catch (e) {
      Logger.error('Could not persist media object.');
      Logger.error(e);
    }
  }

  private async $abort(media: Media) {
    await unlink(media.path);
    await media.delete();
  }

  private async $save(image: sharp.Sharp, path: string) {
    const buffer = await image.toBuffer();
    await writeFile(path, buffer);
  }

  /**
   * Makes sure the image is not wider or higher than allowed
   * @param image
   */
  private async $normalizeSize(image: Image) {
    if (
      image.metadata.width! > MEDIA_MAX_RESOLUTION ||
      image.metadata.height! > MEDIA_MAX_RESOLUTION
    ) {
      image.file.resize(MEDIA_MAX_RESOLUTION, MEDIA_MAX_RESOLUTION, {
        fit: 'inside',
      });

      await this.$save(image.file, image.media.path);
    }
  }

  private async $createRenditions(image: Image) {
    const path = parse(image.media.path);

    const fsOperations: Promise<any>[] = [];
    for (const size of RENDITION_SIZES) {
      if (image.metadata.width! > size) {
        const url = join(
          RENDITION_BASE_PATH,
          `${path.name}-${size}w${path.ext}`
        );

        const file = image.file.clone();
        file.resize(size);

        fsOperations.push(file.toFile(Application.publicPath(url)));

        const metadata = await file.metadata();
        await image.media.related('renditions').create({
          url,
          width: metadata.width,
          height: metadata.height,
          filesize: metadata.size,
          format: metadata.format,
        });
      }
    }

    await Promise.all(fsOperations);
  }
}
