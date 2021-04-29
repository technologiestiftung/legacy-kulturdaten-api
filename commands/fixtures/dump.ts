import { BaseCommand, flags } from '@adonisjs/ace';
import { BaseModel } from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';

export default class DumpFixtures extends BaseCommand {
  public static commandName = 'fixtures:dump';
  public static description =
    'Dumps all instances of a certain model to a JSON file';

  @flags.string({
    name: 'model',
    description: 'Name of the model to be dumped',
  })
  public modelPath: boolean;

  @flags.boolean({
    name: 'pretty',
    description: 'Indent the generated JSON',
  })
  public prettyPrint: boolean;

  @flags.array({
    description:
      'List of attributes that should be serialized on top. Useful for passwords for example',
  })
  public attributes: Array<string>;

  public static settings = {
    loadApp: true,
  };

  private model: typeof BaseModel;
  private data: Array<Object>;

  /**
   * Tries to import the model instance by name. Directly uses the IoC as TypeScript
   * compilation messes up the dynamic import statement. Also checks if the imported
   * class is a model at all
   */
  private async importModel() {
    try {
      const Model = (
        await this.application.container.use(`App/Models/${this.modelPath}`)
      ).default;

      if (new Model() instanceof BaseModel === false) {
        this.logger.error(
          `The model specified does not inherit from BaseModel - is it a model at all?`
        );
        return;
      }

      return Model;
    } catch (e) {
      this.logger.error(`Could not import model from '${this.modelPath}'`);
    }
  }

  private async serializeInstances() {
    const instances = await this.model.all();
    const data = instances.map((instance) => {
      const attributes = instance.toJSON();
      // Check if there are specific attributes that should be serialized
      // and add them to the serialized version
      for (const attribute of this.attributes) {
        attributes[attribute] = instance.$attributes[attribute];
      }

      return attributes;
    });

    return data;
  }

  private buildFixture() {
    let data = this.data;
    return JSON.stringify(
      {
        generator: {
          appName: this.application.appName,
          adonisVersion: this.application.adonisVersion,
          version: this.application.version,
        },
        model: {
          path: this.modelPath,
        },
        data: data,
      },
      undefined,
      this.prettyPrint ? 2 : undefined
    );
  }

  public async run() {
    this.model = await this.importModel();
    if (!this.model) {
      return;
    }

    this.data = await this.serializeInstances();

    this.generator
      .addFile(
        `${DateTime.now().toFormat('yyyyMMddHHmmss')}_${this.model.name}`,
        { extname: '.json' }
      )
      .stub(this.buildFixture(), { raw: true })
      .destinationDir('fixtures')
      .appRoot(this.application.cliCwd || this.application.appRoot);

    await this.generator.run();
  }
}
