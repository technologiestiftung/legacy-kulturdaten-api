import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { LucidModel } from '@ioc:Adonis/Lucid/Model';
import Resource from 'App/Helpers/Api/Resource';
import { LucidRow, ModelPaginatorContract } from '@ioc:Adonis/Lucid/Model';
import { RawBuilderContract } from '@ioc:Adonis/Lucid/DatabaseQueryBuilder';

interface OrderableInstruction {
  name: string;
  attribute?: string;
  query?: RawBuilderContract;
}

interface Includable {
  name: string;
  query?: (query: any) => unknown;
}

interface Filter {
  name: string;
  query: (query: any, name: string, value: string) => unknown;
}

interface Validators {
  translate?;
}

interface ManagerSettings {
  queryId: string;
  orderableBy?: OrderableInstruction[];
  includables?: Includable[];
  filters?: Filter[];
}

type Model<T extends LucidModel> = T;

export class BaseManager {
  public ModelClass: Model<LucidModel>;

  public RessourceClass;

  public instances: Array<LucidRow> = [];

  public paginator: ModelPaginatorContract<LucidRow>;

  public sort: string = '';

  public include: string = '';

  public filter: string = '';

  public ctx: HttpContextContract;

  public method: string;

  public language: string;

  public validators: Validators;

  public settings: ManagerSettings = {
    queryId: 'id',
  };

  constructor(
    ctx: HttpContextContract,
    ModelClass: LucidModel,
    ResourceClass = Resource
  ) {
    this.ModelClass = ModelClass;
    this.RessourceClass = ResourceClass;

    this.ctx = ctx;
    this.language = ctx.language as string;
    this.method = this.ctx.request.method();
  }

  public query(
    options: { sort?: string; includes?: string; filter?: string } = {}
  ) {
    let query = this.ModelClass.query();
    if (this.ModelClass.$hasRelation('translations')) {
      query = query.preload('translations');
    }

    const sort = this.sort || options?.sort || this.ctx.request.input('sort');
    if (sort) {
      query = this.$sortQuery(query, sort);
    }

    const filter =
      this.filter || options?.filter || this.ctx.request.input('filter');
    if (filter) {
      query = this.$filterQuery(query, filter);
    }

    const includes =
      this.ctx.request.input('include') || this.include || options.includes;
    if (includes) {
      query = this.$addIncludesToQuery(query, includes);
    }

    return query;
  }

  private $filterQuery(query, filterString) {
    const filters = filterString.split(',');
    if (!filters.length) {
      console.log('No filters given, returning');
      return query;
    }

    for (const filterString of filters) {
      const [name, value] = filterString.split('=');
      const filter = this.settings.filters?.find((filter) => {
        return filter.name === name;
      });

      if (!filter) {
        console.error('Unknown filter, continue');
        continue;
      }

      filter.query(query, name, value);
    }

    return query;
  }

  private $addIncludesToQuery(query, includesString) {
    let includes;

    // Allow wildcard to enable all includes available
    if (includesString === '*') {
      includes =
        this.settings.includables?.map((includable) => {
          return includable.name;
        }) || [];
    } else {
      includes = includesString.split(',');
    }

    for (const include of includes) {
      const includable = this.settings.includables?.find((includable) => {
        return includable.name === include;
      });

      if (!includable) {
        continue;
      }

      if (includable.query) {
        query = query.preload(includable.name, includable.query);
      } else {
        query = query.preload(includable.name);
      }
    }

    return query;
  }

  private $sortQuery(query, sortString) {
    const instructions = sortString.split(',');
    for (const instruction of instructions) {
      const direction = instruction.startsWith('-') ? 'desc' : 'asc';
      const key =
        instruction[0] === '-' ? instruction.substring(1) : instruction;

      const orderableInstruction = this.settings.orderableBy?.find(
        (orderableInstruction) => {
          return orderableInstruction.name === key;
        }
      );

      if (!orderableInstruction) {
        continue;
      }

      if (orderableInstruction.query) {
        query.orderBy(orderableInstruction.query, direction);
      } else if (orderableInstruction.attribute) {
        query.orderBy(orderableInstruction.attribute, direction);
      }
    }

    return query;
  }

  public async all(
    sort: string | undefined = undefined,
    includes: string | undefined = undefined
  ) {
    const page = this.ctx.request.input('page', 1) || 1;
    const size = this.ctx.request.input('size', 1000) || 1000;

    const result = await this.query({ sort, includes }).paginate(page, size);

    this.paginator = result;
    this.paginator.baseUrl(this.ctx.request.completeUrl());

    this.instances = result.rows;

    return result;
  }

  public fromContext() {
    switch (this.method) {
      case 'POST':
        return this.create();
      case 'PATCH':
        return this.update();
      default:
        return this.byId();
    }
  }

  public async byId(
    id: string | number | undefined = undefined,
    sort: string | undefined = undefined,
    includes: string | undefined = undefined
  ) {
    const instance = await this.query({ sort, includes })
      .where(this.settings.queryId, id || this.ctx.params.id)
      .firstOrFail();

    this.instances = [instance];

    return this.instance;
  }

  public get instance() {
    return this.instances[0];
  }

  public set instance(instance) {
    this.instances = [instance];
  }

  public async create() {
    return [new this.ModelClass()];
  }

  public async update() {
    return this.instances;
  }

  public async $validateTranslation() {
    if (!this.validators.translate) {
      throw 'Translation validator need to be configured to create/update translations';
    }

    const { attributes } = await this.ctx.request.validate(
      new this.validators.translate(this.ctx)
    );

    return attributes;
  }

  public async $saveTranslation(attributes) {
    const translation = this.instance.translations.find((translation) => {
      return translation.language === attributes.language;
    });

    if (!translation) {
      await this.instance.related('translations').create(attributes);
    } else {
      translation.merge(attributes);
      await translation.save();
    }
  }

  public async translate() {
    const attributes = await this.$validateTranslation();
    await this.$saveTranslation(attributes);

    return this.byId();
  }

  private $toResource(instance): Resource {
    const resource = new Resource(instance);
    resource.boot();
    return resource;
  }

  public toResources(): Array<Resource> | Resource {
    if (!this.instances.length) {
      return [];
    }

    if (
      this.instances.length === 1 &&
      (this.ctx.params.id || this.method === 'POST')
    ) {
      return this.$toResource(this.instances[0]);
    }

    return this.instances.map(this.$toResource.bind(this));
  }
}

export default BaseManager;
