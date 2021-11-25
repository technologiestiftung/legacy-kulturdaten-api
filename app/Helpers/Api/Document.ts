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
    resource: ApiResource | undefined | { data: any },
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
    instance: Resource | typeof BaseModel
  ): ResourceObject {
    if (instance instanceof BaseModel) {
      const resource = new Resource(instance);
      resource.boot();
      return resource.toObject();
    }

    const resource: Resource = instance as Resource;
    return resource.toObject();
  }

  private $flatDataItem(ob) {
    let toReturn = {};

    for (let i in ob) {
      if (!ob.hasOwnProperty(i)) continue;
      if (i === 'type' || i === 'id') continue;

      if (typeof ob[i] === 'object' && ob[i] !== null) {
        let flatObject = this.$flatDataItem(ob[i]);
        for (let x in flatObject) {
          if (!flatObject.hasOwnProperty(x)) continue;

          toReturn[i + '.' + x] = flatObject[x];
        }
      } else {
        toReturn[i] = ob[i];
      }
    }
    return toReturn;
  }

  private $export() {
    const workbook = XLSX.utils.book_new();
    const data = types.isArray(this.data) ? this.data : [this.data];

    if (!data.length) {
      return;
    }

    const type = data[0].type;

    const rows = [];
    for (const item of data) {
      rows.push(Object.assign({ id: item.id }, this.$flatDataItem(item)));
    }

    const worksheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, type);

    const buffer = XLSX.write(workbook, { type: 'buffer' });

    this.ctx.response.header(
      'content-type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    this.ctx.response.header('Content-Length', Buffer.byteLength(buffer));
    this.ctx.response.header(
      'Content-Disposition',
      `attachment; filename=${Date.now()}_${type}.xls`
    );
    this.ctx.response.send(buffer);
  }

  public send() {
    if (this.ctx.request.input('format') === 'xls') {
      this.$export();
      return;
    }

    this.ctx.response.ok({
      data: this.data,
      links: this.links,
      meta: this.meta,
    });
  }
}
