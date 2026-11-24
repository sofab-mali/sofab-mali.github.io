// Préchargeur bref (une fois par session) : l'emblème apparaît puis s'efface. Jamais bloquant.
export function initPreloader() {
  if (document.documentElement.classList.contains('reduced')) return;
  let seen = false;
  try { seen = sessionStorage.getItem('sofab-intro') === '1'; sessionStorage.setItem('sofab-intro', '1'); } catch { /* stockage indisponible */ }
  if (seen) return;
  const el = document.createElement('div');
  el.className = 'preloader';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<img src="/assets/icons/emblem-light.svg" width="96" height="96" alt=""><span class="preloader-word"><span>SO</span><span>FAB</span></span>';
  document.body.prepend(el);
  requestAnimationFrame(() => el.classList.add('is-in'));
  setTimeout(() => { el.classList.add('is-out'); document.documentElement.classList.add('intro-done'); }, 750);
  setTimeout(() => el.remove(), 1500);
}
