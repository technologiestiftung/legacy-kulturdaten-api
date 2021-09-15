import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Resource from 'App/Helpers/Api/Resource';
import {
  LucidModel,
  LucidRow,
  ModelPaginatorContract,
} from '@ioc:Adonis/Lucid/Model';
import { RawBuilderContract } from '@ioc:Adonis/Lucid/DatabaseQueryBuilder';
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm';
import Application from '@ioc:Adonis/Core/Application';
import Media, { MEDIA_BASE_PATH } from 'App/Models/Media';
import { cuid } from '@ioc:Adonis/Core/Helpers';
import { join } from 'path';

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

export class BaseManager<ManagedModel extends LucidModel> {
  public ManagedModel: ManagedModel;

  public instances: Array<InstanceType<ManagedModel>> = [];

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

  constructor(ctx: HttpContextContract, ManagedModel: ManagedModel) {
    this.ManagedModel = ManagedModel;

    this.ctx = ctx;
    this.language = ctx.language as string;
    this.method = this.ctx.request.method();
  }

  public query(
    options: { sort?: string; includes?: string; filter?: string } = {}
  ): ModelQueryBuilderContract<ManagedModel> {
    let query = this.ManagedModel.query() as any;
    if (this.ManagedModel.$hasRelation('translations')) {
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

    this.instances = result.all() as InstanceType<ManagedModel>[];

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

  public set instance(instance: InstanceType<ManagedModel>) {
    this.instances = [instance];
  }

  public async create() {
    return new this.ManagedModel();
  }

  public async update() {
    return this.instance;
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
    const instance = this.instance as any;
    const translation = instance.translations.find((translation) => {
      return translation.language === attributes.language;
    });

    if (!translation) {
      await instance.related('translations').create(attributes);
    } else {
      translation.merge(attributes);
      await translation.save();
    }

    await instance.load('translations');
  }

  public async translate() {
    const attributes = await this.$validateTranslation();
    await this.$saveTranslation(attributes);

    return this.instance;
  }

  public async $updateLinks(instance, links) {
    if (links) {
      await instance.load('links');

      let index = 0;
      while (instance.links[index] || links[index]) {
        const link = instance.links[index];
        const url = links[index];

        if (link && url) {
          const link = instance.links[index];
          link.url = links[index];
          await link.save();
        } else if (!link && url) {
          await instance.related('links').create({ url });
        } else if (link && !url) {
          await link.delete();
        }

        index++;
      }

      await instance.load('links');
    }
  }

  public async $storeMedia(instance) {
    const files = this.ctx.request.files('media');
    if (!files.length) {
      return;
    }

    const errors = files.flatMap((file) => {
      return file.errors;
    });

    if (errors.length) {
      throw new Error('There were unhandled file errors.');
    }

    await Promise.all(
      files.map(async (file) => {
        const fileName = `${cuid()}.${file.extname}`;
        await file.move(Application.publicPath(MEDIA_BASE_PATH), {
          name: fileName,
        });

        await instance.related('media').create({
          url: join(MEDIA_BASE_PATH, fileName),
          filesize: file.size,
        });
      })
    );

    await instance.load('media');
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
