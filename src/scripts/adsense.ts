/**
 * Pide cada bloque de AdSense cuando está por entrar en pantalla (carga diferida),
 * y nunca los que están ocultos (por ejemplo, la barra lateral en celular).
 */
declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const SELECTOR = 'ins.adsbygoogle:not([data-requested])';

function request(slot: HTMLElement) {
  if (slot.offsetParent === null) return; // oculto con display: none
  slot.setAttribute('data-requested', '');
  (window.adsbygoogle ??= []).push({});
}

export function initAdSense(): void {
  const slots = document.querySelectorAll<HTMLElement>(SELECTOR);
  if (slots.length === 0) return;
  if (!('IntersectionObserver' in window)) {
    slots.forEach(request);
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        request(entry.target as HTMLElement);
      }
    },
    { rootMargin: '400px 0px' },
  );
  slots.forEach((slot) => observer.observe(slot));
}
