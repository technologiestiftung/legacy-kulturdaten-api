import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { RequestContract } from '@ioc:Adonis/Core/Request';
import {
  allowedLanguages,
  allowedCountries,
  defaultLanguage,
  defaultCountry,
} from 'Config/app';

export default class LocaleMiddleware {
  /**
   * Handle request
   */
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const { request }: RequestContract = ctx;

    ctx.language = defaultLanguage;
    ctx.country = defaultCountry;

    const locale: string =
      request.qs().locale || request.language(allowedLanguages);
    const [language, country]: [string, string] = locale.split('-');

    if (allowedLanguages.includes(language)) {
      ctx.language = language;
    }

    if (allowedLanguages.includes(country)) {
      ctx.country = country;
    }

    await next();
  }
}
