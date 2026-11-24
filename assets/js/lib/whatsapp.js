// Partagé entre le build (Node) et le navigateur (module ES).
export const WA_NUMBER = '22376967909';

export function waLink(message, phone = WA_NUMBER) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

const LABELS = {
  fr: { hello: 'Bonjour SOFAB,', name: 'Nom :', phone: 'Téléphone :', subject: 'Objet :', message: 'Message :' },
  en: { hello: 'Hello SOFAB,', name: 'Name:', phone: 'Phone:', subject: 'Subject:', message: 'Message:' },
};

export function composeMessage(fields, lang) {
  const L = LABELS[lang] || LABELS.fr;
  const lines = [L.hello];
  for (const key of ['name', 'phone', 'subject', 'message']) {
    const v = String(fields[key] ?? '').trim();
    if (v) lines.push(`${L[key]} ${v}`);
  }
  return lines.join('\n');
}

export function validateContact(fields) {
  if (String(fields.website ?? '').trim()) return { ok: false, errors: ['bot'] };
  const errors = ['name', 'message'].filter((k) => !String(fields[k] ?? '').trim());
  return { ok: errors.length === 0, errors };
}
