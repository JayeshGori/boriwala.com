// Centralized contact info for the website
// Update here once and it reflects everywhere.

export const WHATSAPP_NUMBER = '917405337635';
export const PHONE_NUMBER = '+917405337635';
export const PHONE_DISPLAY = '+91 74053 37635';

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
