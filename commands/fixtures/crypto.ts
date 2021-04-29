import { BaseCommand, flags } from '@adonisjs/ace';
import { readFile, writeFile } from 'fs/promises';
import Encryption from '@ioc:Adonis/Core/Encryption';

export default class LoadFixtures extends BaseCommand {
  public static commandName = 'fixtures:crypto';
  public static description = 'Encrypts or decrypts a specific fixture dataset';

  @flags.string({
    name: 'file',
    description: 'Path to the fixture to be en- or decrypted',
  })
  public fixtureFile: string;

  @flags.boolean({
    name: 'pretty',
    description: 'Indent the generated JSON',
  })
  public prettyPrint: boolean;

  public static settings = {
    loadApp: true,
  };

  protected fixture: Object;

  private async loadFixture() {
    const content = await readFile(
      `${this.application.makePathFromCwd('fixtures/')}${
        this.fixtureFile
      }.json`,
      'utf8'
    );
    try {
      const fixture = JSON.parse(content);
      return fixture;
    } catch (e) {
      this.logger.error(`Could not parse ${baseName}. Invalid JSON probably?`);
    }
  }

  public async run() {
    this.fixture = await this.loadFixture();
    if (this.fixture.encrypted) {
      this.fixture.data = JSON.parse(Encryption.decrypt(this.fixture.data));
    } else {
      this.fixture.data = Encryption.encrypt(JSON.stringify(this.fixture.data));
    }

    this.fixture.encrypted = !this.fixture.encrypted;
    await writeFile(
      this.application.makePathFromCwd(`fixtures/${this.fixtureFile}.json`),
      JSON.stringify(this.fixture, undefined, this.prettyPrint ? 2 : undefined)
    );

    this.logger.success(`En- or decrypted ${this.fixtureFile}`);
  }
}
