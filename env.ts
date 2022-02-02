/*
|--------------------------------------------------------------------------
| Validating Environment Variables
|--------------------------------------------------------------------------
|
| In this file we define the rules for validating environment variables.
| By performing validation we ensure that your application is running in
| a stable environment with correct configuration values.
|
| This file is read automatically by the framework during the boot lifecycle
| and hence do not rename or move this file to a different location.
|
*/

import Env from '@ioc:Adonis/Core/Env';

export default Env.rules({
  HOST: Env.schema.string({ format: 'host' }),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  APP_NAME: Env.schema.string(),
  API_URL: Env.schema.string(),
  APP_URL: Env.schema.string(),
  NODE_ENV: Env.schema.enum([
    'development',
    'live',
    'beta',
    'testing',
  ] as const),

  CACHE_VIEWS: Env.schema.boolean(),

  DB_CONNECTION: Env.schema.string(),
  DB_HOST: Env.schema.string.optional(),
  DB_USER: Env.schema.string.optional(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_NAME: Env.schema.string.optional(),

  DRIVE_DISK: Env.schema.string(),
  S3_KEY: Env.schema.string(),
  S3_SECRET: Env.schema.string(),
  S3_REGION: Env.schema.string(),
  S3_BUCKET: Env.schema.string(),
  S3_ENDPOINT: Env.schema.string.optional(),

  FROM_EMAIL: Env.schema.string({ format: 'email' }),
  SMTP_HOST: Env.schema.string({ format: 'host' }),
  SMTP_PORT: Env.schema.number(),
  SMTP_USERNAME: Env.schema.string(),
  SMTP_PASSWORD: Env.schema.string(),
});
