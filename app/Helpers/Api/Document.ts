import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BaseResource, {
  ResourceObject,
} from 'App/Helpers/Api/Resources/BaseResource';
import { BaseModel } from '@ioc:Adonis/Lucid/Orm';
import { LucidModel } from '@ioc:Adonis/Lucid/Model';
import { SimplePaginatorContract } from '@ioc:Adonis/Lucid/Database';
import { LucidRow, ModelPaginatorContract } from '@ioc:Adonis/Lucid/Model';

type ApiResource = BaseResource | Array<BaseResource> | LucidModel;

type ApiDocumentData = ResourceObject | Array<ResourceObject>;

interface ApiDocumentMeta {
  message?: string;
  language?: string;
  paginator?:
    | ModelPaginatorContract<LucidRow>
    | SimplePaginatorContract<LucidRow>;
  pages?: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
  };
  [key: string]: any;
}

interface ApiDocumentLinks {
  self: string;
  first: string;
  prev: string;
  next: string;
  last: string;
}

/**
 * An API Document describes a successful response to an API request.
 * Requests causing errors are supposed to be handled in respective
 * exception handlers
 */
export class ApiDocument {
  public ctx: HttpContextContract;

  public language: string;

  public data: ApiDocumentData;

  public meta: ApiDocumentMeta;

  public links: ApiDocumentLinks;

  /**
   *
   * @param ctx
   * @param resource
   * @param message
   * @param hold
   */
  constructor(
    ctx: HttpContextContract,
    resource: ApiResource | undefined,
    meta: ApiDocumentMeta = {},
    hold: boolean = false
  ) {
    this.ctx = ctx;
    this.language = ctx.language as string;

    if (resource) {
      this.data = this.$transformResource(resource);
    }

    this.meta = meta;

    if (this.meta.paginator) {
      this.$transformPaginator(this.meta.paginator);
      delete this.meta.paginator;
    }

    this.meta.language = this.language;

    if (!hold) {
      this.send();
    }
  }

  private $transformPaginator(paginator) {
    const pagination = paginator.toJSON().meta;
    this.links = {
      self: this.ctx.request.completeUrl(true),
      first: pagination.firstPageUrl,
      prev: pagination.previousPageUrl,
      next: pagination.nextPageUrl,
      last: pagination.lastPageUrl,
    };

    this.meta.pages = {
      total: pagination.total,
      perPage: pagination.perPage,
      currentPage: pagination.currentPage,
      lastPage: pagination.lastPage,
    };
  }

  private $transformResource(resource: ApiResource): ApiDocumentData {
    if (Array.isArray(resource)) {
      return resource.map(this.$getResourceObject);
    }

    return this.$getResourceObject(resource);
  }

  private $getResourceObject(
    instance: BaseResource | typeof BaseModel
  ): ResourceObject {
    if (instance instanceof BaseModel) {
      const resource = new BaseResource(instance, this.language);
      resource.boot();
      return resource.toObject();
    }

    const resource: BaseResource = instance as BaseResource;
    return resource.toObject();
  }

  public send() {
    this.ctx.response.ok({
      data: this.data,
      links: this.links,
      meta: this.meta,
    });
  }
}
