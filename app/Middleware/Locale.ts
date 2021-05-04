import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class LocaleMiddleware {
  /**
   * Handle request
   */
  public async handle(
    { auth }: HttpContextContract,
    next: () => Promise<void>
  ) {
    /**
     * Check if user is logged-in or not. If yes, then `ctx.auth.user` will be
     * set to the instance of the currently logged in user.
     */
    await auth.check();
    await next();
  }
}
