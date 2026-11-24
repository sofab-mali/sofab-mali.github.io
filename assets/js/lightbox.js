// Visionneuse d'images basée sur <dialog> (piège de focus et Échap natifs).
export function initLightbox() {
  const dialog = document.querySelector('[data-lightbox-dialog]');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const img = dialog.querySelector('[data-lb-img]');
  const caption = dialog.querySelector('[data-lb-caption]');
  let items = [];
  let index = 0;

  const show = (i) => {
    index = (i + items.length) % items.length;
    const a = items[index];
    dialog.classList.remove('is-loaded');
    img.onload = () => dialog.classList.add('is-loaded');
    img.src = a.getAttribute('href');
    img.alt = a.dataset.caption || '';
    caption.textContent = a.dataset.caption || '';
  };

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-lightbox]');
    if (!a) return;
    e.preventDefault();
    items = [...document.querySelectorAll(`a[data-lightbox="${a.dataset.lightbox}"]`)].filter((x) => !x.closest('[hidden]'));
    show(items.indexOf(a));
    dialog.showModal();
  });

  dialog.querySelector('[data-lb-close]').addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-lb-prev]').addEventListener('click', () => show(index - 1));
  dialog.querySelector('[data-lb-next]').addEventListener('click', () => show(index + 1));
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { img.removeAttribute('src'); });
}
