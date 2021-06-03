import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { LucidModel } from '@ioc:Adonis/Lucid/Model';
import BaseResource from 'App/Helpers/Api/Resources/BaseResource';

export class BaseManager {
  public ModelClass;

  public RessourceClass;

  public instances: Array<LucidModel> = [];

  public ctx: HttpContextContract;

  public language: string;

  public queryId = 'id';

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
    let query = this.ModelClass.query();
    if (this.ModelClass.$hasRelation('translations')) {
      query = query.preload('translations');
    }

    return query;
  }

  public async all() {
    this.instances = await this.query();
    return this.instances;
  }

  public fromContext() {
    const method = this.ctx.request.method();
    switch (method) {
      case 'POST':
        return this.create();
        break;

      default:
        return this.byId(this.ctx.params.id);
    }
  }

  public async byId(id: string | number) {
    const instance = await this.query().where(this.queryId, id).firstOrFail();

    this.instances = [instance];

    return this.instances;
  }

  public async create() {
    return new this.ModelClass();
  }

  public toResources(): Array<BaseResource> {
    if (!this.instances.length) {
      return [];
    }

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
