// Révélations au défilement (classe .is-in), en cascade par groupe de frères.
export function initReveal() {
  const els = [...document.querySelectorAll('[data-reveal]')];
  if (document.documentElement.classList.contains('reduced') || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  document.documentElement.classList.add('reveal-on');
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      en.target.classList.add('is-in');
      io.unobserve(en.target);
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  els.forEach((el) => {
    const sibs = [...el.parentElement.children].filter((c) => c.hasAttribute('data-reveal'));
    el.style.setProperty('--i', Math.min(sibs.indexOf(el), 6));
    io.observe(el);
  });
}

// Barre de progression de lecture
export function initProgress() {
  const bar = document.createElement('div');
  bar.className = 'read-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.append(bar);
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}
