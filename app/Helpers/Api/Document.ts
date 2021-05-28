import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BaseResource, {
  ResourceObject,
} from 'App/Helpers/Api/Resources/BaseResource';
import { BaseModel } from '@ioc:Adonis/Lucid/Orm';

type ApiResource = BaseResource | Array<BaseResource> | typeof BaseModel;

type ApiDocumentData = ResourceObject | Array<ResourceObject>;

interface ApiDocumentMeta {
  message?: string;
  language?: string;
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

  /**
   *
   * @param ctx
   * @param resource
   * @param message
   * @param hold
   */
  constructor(
    ctx: HttpContextContract,
    resource: ApiResource,
    meta: ApiDocumentMeta = {},
    hold: boolean = false
  ) {
    this.ctx = ctx;
    this.language = ctx.language as string;

    this.data = this.$transformResource(resource);

    this.meta = meta;
    this.meta.language = this.language;

    if (!hold) {
      this.send();
    }
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
      meta: this.meta,
    });
  }
}
