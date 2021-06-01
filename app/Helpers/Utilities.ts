export function withTranslations(query) {
  return query.preload('translations');
}
