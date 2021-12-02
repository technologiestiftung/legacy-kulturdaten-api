import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Resource, { ResourceObject } from 'App/Helpers/Api/Resource';
import { BaseModel } from '@ioc:Adonis/Lucid/Orm';
import { LucidModel } from '@ioc:Adonis/Lucid/Model';
import { SimplePaginatorContract } from '@ioc:Adonis/Lucid/Database';
import { LucidRow, ModelPaginatorContract } from '@ioc:Adonis/Lucid/Model';
import * as XLSX from 'xlsx';
import { types } from '@ioc:Adonis/Core/Helpers';

type ApiResource = Resource | Array<Resource> | LucidModel;

type ApiDocumentData = ResourceObject | Array<ResourceObject>;

interface ApiDocumentMeta {
  message?: string;
  language?: string;
  paginator?:
    | ModelPaginatorContract<LucidRow>
    | SimplePaginatorContract<LucidRow>;
  transformer?: any;
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

const FALLBACK_EXPORT_TYPE = 'kulturdaten';

/**
 * An API Document describes a successful response to an API request.
 * Requests causing errors are supposed to be handled in respective
 * exception handlers
 */
export class ApiDocument {
  public ctx: HttpContextContract;

  public language: string;

  public format: string;

  public data: ApiDocumentData;

  public meta: ApiDocumentMeta;

  private transformer: any;

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
    resource: ApiResource | undefined | { data: any },
    meta: ApiDocumentMeta = {},
    hold: boolean = false
  ) {
    this.ctx = ctx;
    this.language = ctx.language as string;
    this.format = this.ctx.request.input('format') || 'json';

    if (meta.transformer) {
      this.transformer = meta.transformer;
      delete meta.transformer;
    }

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
      return resource.map(this.$getResourceObject.bind(this));
    }

    return this.$getResourceObject(resource);
  }

  private $getResourceObject(instance: Resource | typeof BaseModel) {
    let resourceObject = {};
    if (instance instanceof BaseModel) {
      const resource = new Resource(instance);
      resource.boot();

      resourceObject = resource.toObject();
    } else {
      const resource: Resource = instance as Resource;
      resourceObject = resource.toObject();
    }

    if (this.transformer) {
      const transformer = new this.transformer(this.ctx, resourceObject);
      transformer.run();
    }

    if (this.format === 'xls') {
      resourceObject = this.$flattenResourceObject(resourceObject);
    }

    return resourceObject;
  }

  private $flattenResourceObject(resource) {
    let flatResource = {};

    for (let i in resource) {
      if (!resource.hasOwnProperty(i)) continue;

      if (typeof resource[i] === 'object' && resource[i] !== null) {
        let flatObject = this.$flattenResourceObject(resource[i]);
        for (let x in flatObject) {
          if (!flatObject.hasOwnProperty(x)) continue;

          flatResource[i + '.' + x] = flatObject[x];
        }
      } else {
        flatResource[i] = resource[i];
      }
    }
    return flatResource;
  }

  private $toXlsDocument() {
    const data = types.isArray(this.data) ? this.data : [this.data];

    const type = data[0].type;
    const fileName = `${Date.now()}_${type || FALLBACK_EXPORT_TYPE}.xls`;
    const workbook = XLSX.utils.book_new();

    const rows = [];
    for (const item of data) {
      rows.push(Object.assign({ id: item.id }, item));
    }

    const worksheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      type || FALLBACK_EXPORT_TYPE
    );

    const buffer = XLSX.write(workbook, { type: 'buffer' });

    return [fileName, buffer];
  }

  public send() {
    if (this.ctx.request.input('format') === 'xls') {
      const [fileName, buffer] = this.$toXlsDocument();

      this.ctx.response.header(
        'content-type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      this.ctx.response.header('Content-Length', Buffer.byteLength(buffer));
      this.ctx.response.header(
        'Content-Disposition',
        `attachment; filename=${fileName}`
      );
      this.ctx.response.send(buffer);
      return;
    }

    this.ctx.response.ok({
      data: this.data,
      links: this.links,
      meta: this.meta,
    });
  }
}
