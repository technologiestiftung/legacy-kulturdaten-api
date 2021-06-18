import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { LucidModel } from '@ioc:Adonis/Lucid/Model';
import BaseResource from 'App/Helpers/Api/Resources/BaseResource';
import { LucidRow, ModelPaginatorContract } from '@ioc:Adonis/Lucid/Model';
import { RawBuilderContract } from '@ioc:Adonis/Lucid/DatabaseQueryBuilder';
import { findTranslation } from '../Utilities';

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

  public ctx: HttpContextContract;

  public language: string;

  public validators: Validators;

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
    let query = this.ModelClass.query();
    if (this.ModelClass.$hasRelation('translations')) {
      query = query.preload('translations');
    }

    if (this.ctx.request.input('sort')) {
      query = this.$sortQuery(query);
    }

    if (this.ctx.request.input('include')) {
      query = this.$addIncludesToQuery(query);
    }

    return query;
  }

  private $addIncludesToQuery(query) {
    const includes = this.ctx.request.input('include', '').split(',');
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
        query.orderBy(orderableInstruction.query, direction);
      } else if (orderableInstruction.attribute) {
        query.orderBy(orderableInstruction.attribute, direction);
      }
    }

    return query;
  }

  public async all() {
    const page = this.ctx.request.input('page', 1) || 1;
    const size = this.ctx.request.input('size', 1000) || 1000;

    const result = await this.query().paginate(page, size);

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

  public async byId(id: string | number | undefined) {
    const instance = await this.query()
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

  private $toResource(instance): BaseResource {
    const resource: BaseResource = new this.RessourceClass(instance);
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
