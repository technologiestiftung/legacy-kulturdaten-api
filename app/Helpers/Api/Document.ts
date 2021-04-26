import { ResponseContract } from '@ioc:Adonis/Core/Response';
import { ApiResource } from './Resource';
import { LucidRow } from '@ioc:Adonis/Lucid/Model';

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
    response: ResponseContract,
    body: ApiDocumentBody = {},
    message?: String
  ) {
    const data = body.data ? ApiResource.create(body.data) : null;
    const meta = Object.assign({}, body.meta, { message: message });

    response.ok({
      data,
      meta,
    });
  }
}
