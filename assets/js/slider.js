// Liaison DOM du slider hero. La logique d'état vit dans slider-core.js (testée).
import { createSlider } from './slider-core.js';

export function initSlider(root = document.querySelector('[data-slider]')) {
  if (!root) return;
  const slides = [...root.querySelectorAll('[data-slide]')];
  const track = root.querySelector('[data-track]');
  const controls = root.querySelector('[data-controls]');
  const dots = [...root.querySelectorAll('[data-dot]')];
  const current = root.querySelector('[data-current]');
  const toggle = root.querySelector('[data-toggle]');
  const reduced = document.documentElement.classList.contains('reduced');
  const core = createSlider({ count: slides.length, interval: 6500, paused: reduced ? ['reduced'] : [] });

  root.classList.add('is-ready');
  controls.hidden = false;
  // Toutes les slides occupent leur place (pas de décalage de mise en page), mais l'image d'une
  // slide inactive reste en display:none (donc non téléchargée) tant qu'elle n'est pas « amorcée ».
  slides.forEach((s, i) => {
    s.hidden = false;
    if (i !== 0) { s.inert = true; s.setAttribute('aria-hidden', 'true'); }
  });
  slides[0].classList.add('is-primed');
  const reveal = (s) => s.classList.add('is-primed');
  // Une fois la page chargée, on prépare la slide suivante en arrière-plan.
  addEventListener('load', () => setTimeout(() => reveal(slides[1]), 1500), { once: true });
  dots[0]?.setAttribute('aria-current', 'true');

  const liveState = () => track.setAttribute('aria-live', core.isPlaying ? 'off' : 'polite');

  core.onChange((n, o) => {
    slides[o].classList.remove('is-active');
    slides[o].classList.add('is-leaving');
    slides[o].inert = true;
    slides[o].setAttribute('aria-hidden', 'true');
    setTimeout(() => slides[o].classList.remove('is-leaving'), 900);
    if (slides[n + 1]) setTimeout(() => reveal(slides[n + 1]), 1200);
    reveal(slides[n]);
    slides[n].classList.add('is-active');
    slides[n].inert = false;
    slides[n].removeAttribute('aria-hidden');
    dots.forEach((d, i) => (i === n ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current')));
    dots[o].style.setProperty('--p', 0);
    current.textContent = String(n + 1).padStart(2, '0');
  });

  // Boucle d'animation : avance le temps et la jauge de progression
  let last = performance.now();
  const loop = (now) => {
    core.tick(Math.min(now - last, 100));
    last = now;
    dots[core.index]?.style.setProperty('--p', core.isPlaying || core.progress ? core.progress : 0);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  core.play();

  const pause = (r) => { core.pause(r); liveState(); };
  const resume = (r) => { core.resume(r); liveState(); };

  root.querySelector('[data-prev]').addEventListener('click', () => core.prev());
  root.querySelector('[data-next]').addEventListener('click', () => core.next());
  dots.forEach((d) => d.addEventListener('click', () => core.goTo(Number(d.dataset.dot))));

  if (reduced) toggle.hidden = true;
  toggle.addEventListener('click', () => {
    const paused = toggle.classList.toggle('is-paused');
    toggle.setAttribute('aria-label', paused ? toggle.dataset.labelPlay : toggle.dataset.labelPause);
    paused ? pause('user') : resume('user');
  });

  if (matchMedia('(hover: hover)').matches) {
    track.addEventListener('pointerenter', () => pause('hover'));
    track.addEventListener('pointerleave', () => resume('hover'));
  }
  root.addEventListener('focusin', () => pause('focus'));
  root.addEventListener('focusout', (e) => { if (!root.contains(e.relatedTarget)) resume('focus'); });
  document.addEventListener('visibilitychange', () => (document.hidden ? pause('hidden') : resume('hidden')));
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => (en.isIntersecting ? resume('offscreen') : pause('offscreen'))).observe(root);
  }

  root.addEventListener('keydown', (e) => {
    if (e.target.closest('a, input, textarea')) return;
    if (e.key === 'ArrowLeft') { core.prev(); e.preventDefault(); }
    if (e.key === 'ArrowRight') { core.next(); e.preventDefault(); }
  });

  // Balayage tactile
  let x0 = null;
  track.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') x0 = e.clientX; }, { passive: true });
  track.addEventListener('pointerup', (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) (dx < 0 ? core.next() : core.prev());
  }, { passive: true });
  track.addEventListener('pointercancel', () => { x0 = null; });
}
