// Façades TikTok : rien n'est chargé depuis TikTok avant le clic.
export function tiktokPlayerUrl(id) {
  if (!/^\d{10,25}$/.test(String(id))) throw new Error(`Identifiant TikTok invalide : ${id}`);
  return `https://www.tiktok.com/player/v1/${id}?autoplay=1&rel=0`;
}

// Date de publication encodée dans l'identifiant TikTok (32 bits de poids fort = secondes Unix).
export function tiktokDate(id) {
  return new Date(Number(BigInt(id) >> 32n) * 1000);
}

export function initTiktok() {
  const dialog = document.querySelector('[data-tiktok-dialog]');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const frame = dialog.querySelector('[data-tiktok-frame]');
  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-tiktok-id]');
    if (!card) return;
    e.preventDefault();
    const iframe = document.createElement('iframe');
    iframe.src = tiktokPlayerUrl(card.dataset.tiktokId);
    iframe.title = card.getAttribute('aria-label') || 'TikTok';
    iframe.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
    iframe.allowFullscreen = true;
    frame.replaceChildren(iframe);
    dialog.showModal();
  });
  dialog.querySelector('[data-tiktok-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => frame.replaceChildren());
}

export function initVideo() {
  for (const wrap of document.querySelectorAll('[data-video]')) {
    const video = wrap.querySelector('video');
    const btn = wrap.querySelector('[data-video-play]');
    btn.hidden = false;
    video.controls = false;
    btn.addEventListener('click', () => {
      wrap.classList.add('is-playing');
      video.controls = true;
      video.play();
    });
  }
}
