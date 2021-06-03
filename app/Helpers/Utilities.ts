export function withTranslations(query) {
  return query.preload('translations');
}

export function findTranslation(translations, language) {
  return translations.find((translation) => {
    return translation.language == language;
  });
}
