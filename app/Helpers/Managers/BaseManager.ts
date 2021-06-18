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

interface Validators {
  translate?;
}

interface ManagerSettings {
  queryId: string;
  orderableBy?: OrderableInstruction[];
  includables?: Includable[];
}

type Model<T extends LucidModel> = T;

export class BaseManager {
  public ModelClass: Model<LucidModel>;

  public RessourceClass;

  public instances: Array<LucidRow> = [];

  public paginator: ModelPaginatorContract<LucidRow>;

  public sort: string = '';

  public include: string = '';

  public ctx: HttpContextContract;

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
  }

  public query(sortString: string = '', includesString: string = '') {
    let query = this.ModelClass.query();
    if (this.ModelClass.$hasRelation('translations')) {
      query = query.preload('translations');
    }

    const sort = this.sort || sortString || this.ctx.request.input('sort');
    if (sort) {
      query = this.$sortQuery(query, sort);
    }

    const includes =
      this.include || includesString || this.ctx.request.input('include');
    if (includes) {
      query = this.$addIncludesToQuery(query, includes);
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
        return includable.name == include;
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

    const result = await this.query(sort, includes).paginate(page, size);

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
        return this.byId();
    }
  }

  public async byId(
    id: string | number | undefined = undefined,
    sort: string | undefined = undefined,
    includes: string | undefined = undefined
  ) {
    const instance = await this.query(sort, includes)
      .where(this.settings.queryId, id || this.ctx.params.id)
      .firstOrFail();

    this.instances = [instance];

    return this.instances;
  }

  get instance() {
    return this.instances[0];
  }

  set instance(instance) {
    this.instances = [instance];
  }

  public async create() {
    return [new this.ModelClass()];
  }

  public async update() {
    return this.instances;
  }

  public async translate() {
    if (!this.validators.translate) {
      throw 'Translation validator need to be configured to create/update translations';
    }

    const { attributes } = await this.ctx.request.validate(
      new this.validators.translate(this.ctx)
    );

    const translation = this.instance.translations.find((translation) => {
      return translation.language == attributes.language;
    });

    if (!translation) {
      await this.instance.related('translations').create(attributes);
    } else {
      translation.merge(attributes);
      await translation.save();
    }

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

    if (this.instances.length == 1) {
      return this.$toResource(this.instances[0]);
    }

    return this.instances.map(this.$toResource.bind(this));
  }
}

export default BaseManager;
