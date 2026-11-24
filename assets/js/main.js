// Point d'entrée : chaque module est isolé, une erreur n'empêche pas les autres.
import { initHeader } from './header.js';
import { initLangSwitch } from './lang.js';
import { initSlider } from './slider.js';
import { initFilters } from './filters.js';
import { initLightbox } from './lightbox.js';
import { initTiktok, initVideo } from './tiktok.js';
import { initContact } from './contact.js';
import { initCounters } from './counters.js';
import { initReveal, initProgress } from './reveal.js';
import { initParallax, initTilt } from './parallax.js';
import { initPreloader } from './preloader.js';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced) document.documentElement.classList.add('reduced');

const safe = (name, fn) => { try { fn(); } catch (err) { console.error(`[sofab] ${name}`, err); } };
safe('preloader', initPreloader);
safe('header', initHeader);
safe('lang', initLangSwitch);
safe('slider', initSlider);
safe('filters', initFilters);
safe('lightbox', initLightbox);
safe('tiktok', initTiktok);
safe('video', initVideo);
safe('contact', initContact);
safe('reveal', initReveal);
safe('counters', initCounters);
safe('progress', initProgress);
safe('parallax', initParallax);
safe('tilt', initTilt);
