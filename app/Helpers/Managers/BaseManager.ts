import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { LucidModel } from '@ioc:Adonis/Lucid/Model';
import BaseResource from 'App/Helpers/Api/Resources/BaseResource';
import { LucidRow, ModelPaginatorContract } from '@ioc:Adonis/Lucid/Model';
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm';
import Database, { QueryClientContract } from '@ioc:Adonis/Lucid/Database';

const DEFAULT_PAGE_LIMIT = 10;

interface OrderableInstruction {
  name: string;
  query?: QueryClientContract;
  attribute?: string;
}

interface ManagerSettings {
  queryId: string;
  orderableBy?: OrderableInstruction[];
}

export class BaseManager {
  public ModelClass: LucidModel;

  public RessourceClass;

  public instances: Array<LucidRow> = [];

  public paginator: ModelPaginatorContract<LucidRow>;

  public ctx: HttpContextContract;

  public language: string;

  public settings: ManagerSettings = {
    queryId: 'id',
  };

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
    let query = this.ModelClass.query() as ModelQueryBuilderContract<
      LucidModel,
      LucidRow
    >;
    if (this.ModelClass.$hasRelation('translations')) {
      query = query.preload('translations');
    }

    if (this.ctx.request.input('sort')) {
      query = this.$sortQuery(query);
    }

    return query;
  }

  private $sortQuery(query) {
    const instructions = this.ctx.request.input('sort', '').split(',');
    for (const instruction of instructions) {
      const direction = instruction.startsWith('-') ? 'desc' : 'asc';
      const key =
        instruction[0] == '-' ? instruction.substring(1) : instruction;

      const orderableInstruction = this.settings.orderableBy?.find(
        (orderableInstruction) => {
          return orderableInstruction.name == key;
        }
      );

      if (!orderableInstruction) {
        continue;
      }

      if (orderableInstruction.query) {
        query = query.orderBy(orderableInstruction.query, direction);
      } else if (orderableInstruction.attribute) {
        query = query.orderBy(orderableInstruction.attribute, direction);
      }
    }

    return query;
  }

  public async all() {
    const page = this.ctx.request.input('page', 1) || 1;

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
    const instance = await this.query()
      .where(this.settings.queryId, id)
      .firstOrFail();

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
