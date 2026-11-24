// Compteurs animés : valeur finale toujours présente dans le HTML (sans JS ou mouvement réduit).
import { formatCount } from './format.js';

const easeOutCubic = (x) => 1 - (1 - x) ** 3;

export function countFrames(target, durationMs, t) {
  if (t <= 0) return 0;
  if (t >= durationMs) return target;
  return Math.round(target * easeOutCubic(t / durationMs));
}

export function initCounters() {
  if (document.documentElement.classList.contains('reduced') || !('IntersectionObserver' in window)) return;
  const lang = document.documentElement.lang;
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      io.unobserve(en.target);
      const el = en.target;
      const target = Number(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const start = performance.now();
      const step = (now) => {
        const t = now - start;
        el.textContent = formatCount(countFrames(target, 1600, t), lang) + suffix;
        if (t < 1600) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach((el) => io.observe(el));
}
