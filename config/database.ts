/**
 * Config source: https://git.io/JesV9
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Env from '@ioc:Adonis/Core/Env';
import { OrmConfig } from '@ioc:Adonis/Lucid/Orm';
import Application from '@ioc:Adonis/Core/Application';
import { DatabaseConfig } from '@ioc:Adonis/Lucid/Database';

const databaseConfig: DatabaseConfig & { orm: Partial<OrmConfig> } = {
  /*
  |--------------------------------------------------------------------------
  | Connection
  |--------------------------------------------------------------------------
  |
  | The primary connection for making database queries across the application
  | You can use any key from the `connections` object defined in this same
  | file.
  |
  */
  connection: Env.get('DB_CONNECTION'),

  connections: {
    sqlite: {
      client: 'sqlite',
      connection: {
        filename: Application.tmpPath('db.sqlite3'),
      },
      useNullAsDefault: true,
      healthCheck: false,
      debug: false,
      seeders: {
        paths: ['./database/seeders', './database/inits'],
      },
    },

    mysql: {
      client: 'mysql',
      connection: {
        host: Env.get('DB_HOST'),
        user: Env.get('DB_USER'),
        password: Env.get('DB_PASSWORD'),
        database: Env.get('DB_NAME'),
      },
      healthCheck: true,
      seeders: {
        paths: ['./database/seeders', './database/inits'],
      },
    },
  },

  /*
  |--------------------------------------------------------------------------
  | ORM Configuration
  |--------------------------------------------------------------------------
  |
  | Following are some of the configuration options to tweak the conventional
  | settings of the ORM. For example:
  |
  | - Define a custom function to compute the default table name for a given model.
  | - Or define a custom function to compute the primary key for a given model.
  |
  */
  orm: {},
};

export default databaseConfig;
