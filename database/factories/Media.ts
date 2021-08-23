import Factory from '@ioc:Adonis/Lucid/Factory';
import Media, { MediaTranslation, MEDIA_BASE_PATH } from 'App/Models/Media';
import { DateTime } from 'luxon';
import Application from '@ioc:Adonis/Core/Application';
import { readdir } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';
import { cuid } from '@ioc:Adonis/Core/Helpers';

const DEMO_IMAGES_PATH_SRC = Application.resourcesPath('images/demo');
const DEMO_IMAGES = readdir(DEMO_IMAGES_PATH_SRC);
const DEMO_IMAGES_PATH_DEST = Application.publicPath(MEDIA_BASE_PATH);

const images: any[] = [];

async function getDemoImagePath(faker: Faker.FakerStatic) {
  const demoImageFileName = faker.random.arrayElement(await DEMO_IMAGES);
  return join(DEMO_IMAGES_PATH_SRC, demoImageFileName);
}

async function getImage(faker: Faker.FakerStatic) {
  // Create only 30 images at max, to keep generation of demo
  // data in a reasonable time frame
  if (images.length > 30) {
    return faker.random.arrayElement(images);
  }

  const width = faker.random.arrayElement([600, 800, 1200, 1600, 1800]);
  const height = faker.random.arrayElement([600, 800, 1200, 1600, 1800]);

  let image = sharp(await getDemoImagePath(faker)).resize(width, height, {
    fit: 'cover',
    position: faker.random.arrayElement([
      'top',
      'right top',
      'right',
      'right bottom',
      'bottom',
      'left bottom',
      'left',
      'left top',
    ]),
  });

  // Create filename early in the flow to be able to reference it
  // in logs et al.
  let imageFileName = `DEMO-${cuid()}-${width}x${height}.webp`;

  if (faker.datatype.boolean()) {
    image = image.tint(faker.internet.color());
  } else if (faker.datatype.boolean()) {
    image = image.greyscale();
  }

  if (faker.datatype.boolean()) {
    const overlay = sharp(await getDemoImagePath(faker))
      .resize(width, height, { fit: 'cover' })
      .png()
      .ensureAlpha(0.8);
    image = image.composite([
      { input: await overlay.toBuffer(), blend: 'overlay' },
    ]);

    imageFileName = `DEMO-C-${cuid()}-${width}x${height}.webp`;
  }

  if (faker.datatype.boolean()) {
    image = image.flop();
  }

  await image
    .webp({ quality: 80 })
    .toFile(join(DEMO_IMAGES_PATH_DEST, imageFileName));

  const data = {
    width,
    height,
    fileName: imageFileName,
  };

  images.push(data);
  return data;
}

export const MediaFactory = Factory.define(Media, async ({ faker }) => {
  const createdAt = faker.date.recent(120).toISOString();
  const updatedAt = faker.date.between(createdAt, new Date()).toISOString();

  const expiresAt = faker.date.future(undefined, createdAt).toISOString();

  const image = await getImage(faker);

  return {
    license: faker.random.arrayElement([
      'CC0',
      'CC-BY',
      'CC-BY-SA',
      'CC-by-NC',
      'CC-BY-NC-SA',
      'CC-BY-ND',
      'BY-NC-ND',
    ]),
    width: image.width,
    height: image.height,
    url: `/media/images/original/${image.fileName}`,
    copyright: `${faker.name.firstName()} ${faker.name.lastName()}`,
    expiresAt: DateTime.fromISO(expiresAt),
    createdAt: DateTime.fromISO(createdAt),
    updatedAt: DateTime.fromISO(updatedAt),
  };
})
  .relation('translations', () =>
    Factory.define(MediaTranslation, ({ faker }) => {
      faker.locale = 'de';

      return {
        alternativeText: faker.lorem.sentence(),
      };
    }).build()
  )
  .build();
