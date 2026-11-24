// Formatage des nombres partagé par le build et les compteurs animés.
export function formatCount(value, lang) {
  return new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US').format(Math.round(value));
}
