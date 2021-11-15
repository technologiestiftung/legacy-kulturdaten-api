import Resource from 'App/Helpers/Api/Resource';
import { ValidationException, validator } from '@ioc:Adonis/Core/Validator';
import Env from '@ioc:Adonis/Core/Env';
import { defaultLanguage } from 'Config/app';

export function withTranslations(query) {
  return query.preload('translations');
}

export function queryMedia(query) {
  return query.preload('translations').preload('renditions').preload('license');
}

export function findTranslation(translations, language?) {
  if (!language) {
    return translations[0];
  }

  return translations.find((translation) => {
    return translation.language === language;
  });
}

export async function publishable(
  instance,
  PublishableValidator,
  PublishableTranslationValidator?
) {
  const resource = new Resource(instance).boot().toObject();

  const errors = {};
  try {
    await validator.validate({
      schema: new PublishableValidator().schema,
      data: resource,
    });
  } catch (e) {
    if (e instanceof ValidationException) {
      Object.assign(errors, e.messages);
    } else {
      throw e;
    }
  }

  if (PublishableTranslationValidator) {
    let translations = resource.relations?.translations;
    // Use an empty object to validate against, to force the error
    // even if there is no german/default translation
    let defaultTranslation = { attributes: {} };
    if (translations) {
      defaultTranslation = translations.find((translation) => {
        return translation.attributes?.language === defaultLanguage;
      });
    }

    try {
      await validator.validate({
        schema: new PublishableTranslationValidator().schema,
        data: defaultTranslation,
      });
    } catch (e) {
      if (e instanceof ValidationException) {
        Object.assign(errors, e.messages);
      } else {
        throw e;
      }
    }
  }

  return Object.keys(errors).length ? errors : true;
}

export function absoluteUrl(route: string) {
  return new URL(route, Env.get('APP_URL') as string).toString();
}

export function updateField(attributes, instance, key) {
  if (!attributes) {
    return;
  }

  const value = attributes[key];
  if (value === undefined) {
    return;
  }

  instance[key] = value;
}
