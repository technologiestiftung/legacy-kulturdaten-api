import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { LucidModel } from '@ioc:Adonis/Lucid/Model';
import BaseResource from 'App/Helpers/Api/Resources/BaseResource';
import { LucidRow, ModelPaginatorContract } from '@ioc:Adonis/Lucid/Model';

const DEFAULT_PAGE_LIMIT = 10;

export class BaseManager {
  public ModelClass: LucidModel;

  public RessourceClass;

  public instances: Array<LucidRow> = [];

  public paginator: ModelPaginatorContract<LucidRow>;

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
    const page = this.ctx.request.input('page', 1);
    const result = await this.query().paginate(page, DEFAULT_PAGE_LIMIT);

    this.paginator = result;
    this.paginator.baseUrl(this.ctx.request.completeUrl());

    this.instances = result.rows;

    return result;
  }

  public fromContext() {
    const method = this.ctx.request.method();
    switch (method) {
      case 'POST':
        return this.create();
      case 'PATCH':
        return this.update();
      default:
        return this.byId(this.ctx.params.id);
    }
  }

  public async byId(id: string | number) {
    const instance = await this.query().where(this.queryId, id).firstOrFail();

    this.instances = [instance];

    return this.instances;
  }

  get instance() {
    return this.instances[0] as LucidRow;
  }

  public async create() {
    return new this.ModelClass() as LucidRow;
  }

  public async update() {
    return this.instances;
  }

  private $toResource(instance): BaseResource {
    const resource: BaseResource = new this.RessourceClass(
      instance,
      this.language
    );
    resource.boot();
    return resource;
  }

  public toResources(): Array<BaseResource> | BaseResource {
    if (!this.instances.length) {
      return [];
    }

    if (this.instances.length == 1) {
      return this.$toResource(this.instances[0]);
    }

    return this.instances.map(this.$toResource.bind(this));
  }
}

export default BaseManager;
