import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { LucidModel } from '@ioc:Adonis/Lucid/Model';
import BaseResource from 'App/Helpers/Api/Resources/BaseResource';

export class BaseManager {
  public ModelClass;

  public RessourceClass;

  public instances: Array<LucidModel>;

  public ctx: HttpContextContract;

  public language: string;

  constructor(
    ctx: HttpContextContract,
    ModelClass: LucidModel,
    ResourceClass = BaseResource
  ) {
    this.ModelClass = ModelClass;
    this.RessourceClass = ResourceClass;

    this.ctx = ctx;
    this.language = ctx.language as string;
  }

  public query() {
    return this.ModelClass.query().preload('translations');
  }

  public async all() {
    this.instances = await this.query();
    return this.instances;
  }

  public async fromContext() {
    return await this.byId(this.ctx.params.id);
  }

  public async byId(id: string | number) {
    const instance = await this.query().where('public_id', id).firstOrFail();

    this.instances = [instance];

    return this.instances;
  }

  public toResources(): Array<BaseResource> {
    return this.instances.map((instance) => {
      const resource: BaseResource = new this.RessourceClass(
        instance,
        this.language
      );
      resource.boot();
      return resource;
    });
  }
}

export default BaseManager;
