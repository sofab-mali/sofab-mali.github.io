// Parallaxe légère (transform uniquement), désactivée sur mobile et en mouvement réduit.
export function initParallax() {
  if (document.documentElement.classList.contains('reduced') || !matchMedia('(min-width: 768px)').matches) return;
  const els = [...document.querySelectorAll('[data-parallax]')];
  if (!els.length) return;
  let ticking = false;
  const update = () => {
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) continue;
      const centre = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      el.style.transform = `translate3d(0, ${(centre * -Number(el.dataset.parallax || 40)).toFixed(1)}px, 0)`;
    }
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

// Légère inclinaison des cartes au survol (souris uniquement).
export function initTilt() {
  if (document.documentElement.classList.contains('reduced') || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  for (const card of document.querySelectorAll('.product, .tiktok-card')) {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  }
}
