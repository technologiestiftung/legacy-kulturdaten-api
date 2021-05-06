import { BaseCommand, flags } from '@adonisjs/ace';
import { BaseModel } from '@ioc:Adonis/Lucid/Orm';
import { readFile, writeFile, readdir } from 'fs/promises';
import Encryption from '@ioc:Adonis/Core/Encryption';
import { DateTime } from 'luxon';

export default class LoadFixtures extends BaseCommand {
  public static commandName = 'fixtures:load';
  public static description = 'Loads all fixtures into the database';

  @flags.boolean({
    name: 'verbose',
  })
  public verbose: boolean;

  public static settings = {
    loadApp: true,
  };

  private fixturePaths: Array<string>;

  private async listFixtureFiles() {
    const files = await readdir(this.application.makePath('fixtures'));

    return files
      .filter((file) => file.endsWith('.json'))
      .map((file) => `${this.application.makePath('fixtures/')}${file}`);
  }

  private async loadFixture(path: string) {
    const baseName = path.replace(this.application.makePath('fixtures/'), '');
    const content = await readFile(path, 'utf8');
    try {
      const fixture = JSON.parse(content);
      fixture.baseName = baseName;
      return fixture;
    } catch (e) {
      this.logger.error(`Could not parse ${baseName}. Invalid JSON probably?`);
    }
  }

  private async loadModel(fixture) {
    try {
      return (
        await this.application.container.use(`App/Models/${fixture.model.path}`)
      ).default;
    } catch (e) {
      this.logger.error(
        `Could not load model ${fixture.model.path}. Does it exist in the application?`
      );
    }
  }

  private async importData(Model, fixture) {
    if (fixture.encrypted) {
      fixture.data = JSON.parse(Encryption.decrypt(fixture.data));
      if (!Array.isArray(fixture.data)) {
        this.logger.warning(
          `Could not decrypt ${fixture.baseName} - signed with different APP_KEY?`
        );
        return;
      }
    }

    const counts = {
      success: 0,
      error: 0,
      total: fixture.data.length,
    };

    for (const attributes of fixture.data) {
      try {
        const instance: typeof BaseModel = new Model();
        instance.fill(attributes);
        if (attributes.createdAt) {
          instance.createdAt = DateTime.fromISO(attributes.createdAt);
        }
        if (attributes.updatedAt) {
          instance.updatedAt = DateTime.fromISO(attributes.updatedAt);
        }
        await instance.save();

        counts.success++;
      } catch (e) {
        if (this.verbose) {
          this.logger.error(e);
        }
        counts.error++;
      }
    }

    this.logger.info(
      `Imported fixture ${fixture.baseName}` +
        `: ${counts.success} / ${counts.total} entries, ${counts.error} failed`
    );
  }

  public async run() {
    this.fixturePaths = await this.listFixtureFiles();

    for (const path of this.fixturePaths) {
      const fixture = await this.loadFixture(path);

      if (!fixture) {
        continue;
      }

      const Model = await this.loadModel(fixture);
      if (!Model) {
        continue;
      }

      await this.importData(Model, fixture);
    }
  }
}
