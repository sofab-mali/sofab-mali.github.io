// Formulaire de contact : compose le message et ouvre WhatsApp (aucun serveur).
import { composeMessage, validateContact, waLink } from './lib/whatsapp.js';

export function initContact(form = document.querySelector('[data-contact-form]')) {
  if (!form) return;
  form.hidden = false;
  const status = form.querySelector('[data-form-status]');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = Object.fromEntries(new FormData(form));
    const { ok, errors } = validateContact(fields);
    for (const key of ['name', 'message']) {
      const input = form.elements[key];
      const err = form.querySelector(`#cf-${key}-err`);
      const bad = errors.includes(key);
      input.setAttribute('aria-invalid', String(bad));
      err.hidden = !bad;
    }
    if (!ok) {
      if (errors.includes('bot')) return;
      form.elements[errors[0]].focus();
      return;
    }
    status.hidden = false;
    form.classList.add('is-sent');
    // Navigation directe : fonctionne aussi dans les navigateurs intégrés (TikTok, Facebook)
    // qui bloquent souvent les fenêtres surgissantes.
    location.href = waLink(composeMessage(fields, form.dataset.lang));
  });
}
