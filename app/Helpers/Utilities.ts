import Resource from 'App/Helpers/Api/Resource';
import { ValidationException, validator } from '@ioc:Adonis/Core/Validator';
import Env from '@ioc:Adonis/Core/Env';

export function withTranslations(query) {
  return query.preload('translations');
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
    // Use an empty object to validate against, to force the error
    // even if there are no translations at all
    const translations = resource.relations?.translations || [{}];
    for (const translation of translations) {
      try {
        await validator.validate({
          schema: new PublishableTranslationValidator().schema,
          data: translation,
        });

        // Stop validating if there is only one valid
        // translation
        break;
      } catch (e) {
        if (e instanceof ValidationException) {
          Object.assign(errors, e.messages);
        } else {
          throw e;
        }
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
