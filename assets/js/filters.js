// Filtres de catégories de produits (boutons à bascule).
export function initFilters(root = document.querySelector('[data-filters]')) {
  if (!root) return;
  const cards = [...document.querySelectorAll('[data-products] > [data-cat]')];
  const buttons = [...root.querySelectorAll('[data-filter]')];
  root.hidden = false;
  const section = root.closest('section');
  const more = section.querySelector('[data-show-all]');
  if (more) {
    section.classList.add('is-collapsed');
    more.hidden = false;
    more.addEventListener('click', () => { section.classList.remove('is-collapsed'); more.hidden = true; });
  }

  root.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    const f = btn.dataset.filter;
    if (f !== 'all' && more) { section.classList.remove('is-collapsed'); more.hidden = true; }
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    cards.forEach((c, i) => {
      const show = f === 'all' || c.dataset.cat === f;
      c.hidden = !show;
      if (show) { c.style.setProperty('--i', i % 8); c.classList.remove('is-shown'); void c.offsetWidth; c.classList.add('is-shown'); }
    });
  });
}
