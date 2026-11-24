// Conserve l'ancre courante lors du changement de langue.
export function withHash(href, hash) {
  return /^#[\w-]+$/.test(hash || '') ? href + hash : href;
}

export function initLangSwitch() {
  for (const a of document.querySelectorAll('[data-lang-switch]')) {
    a.addEventListener('click', () => {
      const base = a.getAttribute('href').split('#')[0];
      a.setAttribute('href', withHash(base, location.hash));
      try { localStorage.setItem('sofab-lang', a.getAttribute('hreflang')); } catch { /* stockage indisponible */ }
    });
  }
}
