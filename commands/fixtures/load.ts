import { BaseCommand, flags } from '@adonisjs/ace';
import { BaseModel } from '@ioc:Adonis/Lucid/Orm';
import { readFile, writeFile, readdir } from 'fs/promises';
import Encryption from '@ioc:Adonis/Core/Encryption';

export default class LoadFixtures extends BaseCommand {
  public static commandName = 'fixtures:load';
  public static description = 'Loads all fixtures into the database';

  public static settings = {
    loadApp: true,
  };

  private fixturePaths: Array<string>;

  private async listFixtureFiles() {
    const files = await readdir(this.application.makePathFromCwd('fixtures'));

    return files
      .filter((file) => file.endsWith('.json'))
      .map((file) => `${this.application.makePathFromCwd('fixtures/')}${file}`);
  }

  private async loadFixture(path: string) {
    const baseName = path.replace(
      this.application.makePathFromCwd('fixtures/'),
      ''
    );
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

  private async loadData(fixture) {
    if (!fixture.encrypted) {
      return fixture.data;
    }

    let data = fixture.data;
    try {
      data = Encryption.decrypt(data);
      return JSON.parse(data);
    } catch (e) {
      this.logger.error(
        `Could not decrypt ${fixture.baseName}. Signed with different APP_KEY?`
      );
    }
  }

  private async importData(fixture, Model, data) {
    const counts = {
      success: 0,
      error: 0,
      total: data.length,
    };

    for (const attributes of data) {
      try {
        const instance = new Model();
        instance.fill(attributes);
        await instance.save();

        counts.success++;
      } catch (e) {
        counts.error++;
      }
    }

    this.logger.info(
      `Imported fixture ${fixture.baseName}` +
        `: (${counts.success} / ${counts.total} entries, ${counts.error} failed`
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

      const data = await this.loadData(fixture);
      if (!data || !data.length) {
        continue;
      }

      await this.importData(fixture, Model, data);
    }
  }
}
