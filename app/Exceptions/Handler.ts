import Logger from '@ioc:Adonis/Core/Logger';
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler';

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger);
  }

  public async handle(error, context: HttpContextContract) {
    error.status = error.status || 500;

    if (typeof error.handle === 'function') {
      return error.handle(error, context);
    }

    return this.makeJSONAPIResponse(error, context);
  }
}
