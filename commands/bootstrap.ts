import { BaseCommand, flags } from '@adonisjs/ace';
import { readFile, writeFile } from 'fs/promises';
import Encryption from '@ioc:Adonis/Core/Encryption';
import databaseConfig from 'Config/database';
import { unlink } from 'fs/promises';
import execa from 'execa';

export default class Bootstrap extends BaseCommand {
  public static commandName = 'bootstrap';
  public static description =
    'Makes the application for development use (migrates database, seeds data, ...)';

  @flags.boolean({
    description: 'Resets database if using SQLite',
  })
  public reset: boolean;

  @flags.boolean({
    description:
      'If enabled loads fixtures and seeds dummy data after migration',
  })
  public fill: boolean;

  public static settings = {
    loadApp: true,
  };

  public async run() {
    if (this.reset) {
      if (databaseConfig.connection !== 'sqlite') {
        this.logger.error(
          `Resetting the database only works for SQLite databases.`
        );

        return;
      }

      const sqlite = databaseConfig.connections[databaseConfig.connection];
      try {
        await unlink(sqlite.connection.filename);
        this.logger.success(`Resetted database.`);
      } catch (e) {
        this.logger.warning(`Resetting the database failed: ${e}`);
      }
    }

    await execa.node('ace', ['migration:run'], {
      stdio: 'inherit',
    });

    if (this.fill) {
      await execa.node('ace', ['fixtures:load'], {
        stdio: 'inherit',
      });

      await execa.node('ace', ['db:seed'], {
        stdio: 'inherit',
      });
    }
  }
}
