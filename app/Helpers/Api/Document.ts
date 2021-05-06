import { ApiResource } from './Resource';
import { LucidRow } from '@ioc:Adonis/Lucid/Model';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

interface ApiDocumentBody {
  data?: LucidRow | Array<LucidRow>;
  meta?: Object;
}

/**
 * An API Document describes a successful response to an API request.
 * Requests causing errors are supposed to be handled in respective
 * exception handlers
 */
export class ApiDocument {
  constructor(
    ctx: HttpContextContract,
    body: ApiDocumentBody = {},
    message?: String
  ) {
    const data = body.data ? ApiResource.create(ctx, body.data) : null;
    const meta = Object.assign({}, body.meta, { message: message });

    ctx.response.ok({
      data,
      meta,
    });
  }
}
