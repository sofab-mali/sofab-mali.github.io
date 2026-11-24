// En-tête : compactage au défilement, menu mobile accessible, lien actif.
export function initHeader() {
  const header = document.querySelector('[data-header]');
  const burger = document.querySelector('[data-burger]');
  const nav = document.querySelector('[data-nav]');
  if (!header) return;

  const onScroll = () => header.classList.toggle('is-solid', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (burger && nav) {
    const setOpen = (open) => {
      document.documentElement.classList.toggle('nav-open', open);
      // Le reste de la page devient inerte : le focus clavier reste dans le menu ouvert.
      for (const el of document.querySelectorAll('main, .site-footer, .wa-float, .read-progress')) el.inert = open;
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? burger.dataset.labelClose : burger.dataset.labelOpen);
      if (!open) burger.focus({ preventScroll: true });
    };
    burger.addEventListener('click', () => setOpen(burger.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') setOpen(false);
    });
  }

  // Lien actif selon la section visible + indicateur glissant (ordinateur)
  const links = [...document.querySelectorAll('.nav-link[href^="#"]')];
  const indicator = document.querySelector('[data-nav-indicator]');
  const desktop = matchMedia('(min-width: 1024px)');
  let current = null;

  const light = (target) => {
    links.forEach((a) => a.classList.toggle('is-lit', a === target));
    if (!indicator) return;
    if (!target || !desktop.matches) { indicator.classList.remove('is-on'); return; }
    indicator.style.width = `${target.offsetWidth}px`;
    indicator.style.transform = `translateX(${target.offsetLeft}px)`;
    indicator.classList.add('is-on');
  };
  links.forEach((a) => {
    a.addEventListener('pointerenter', () => light(a));
    a.addEventListener('focus', () => light(a));
  });
  nav?.addEventListener('pointerleave', () => light(current));
  nav?.addEventListener('focusout', (e) => { if (!nav.contains(e.relatedTarget)) light(current); });
  desktop.addEventListener('change', () => light(current));
  addEventListener('resize', () => light(current), { passive: true });

  // On observe toutes les sections : dans une section absente du menu, aucun lien n'est actif.
  const sections = [...document.querySelectorAll('main > section[id]')];
  if (!('IntersectionObserver' in window) || !sections.length) return;
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      current = links.find((a) => a.getAttribute('href') === `#${en.target.id}`) || null;
      links.forEach((a) => (a === current ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current')));
      if (!nav.matches(':hover')) light(current);
    }
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((sec) => io.observe(sec));
  // Haut de page : aucune section active
  addEventListener('scroll', () => { if (scrollY < innerHeight * 0.4 && current) { current = null; links.forEach((a) => a.removeAttribute('aria-current')); light(null); } }, { passive: true });
}
