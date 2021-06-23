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
