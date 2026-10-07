/**
 * Atajo de teclado "/": enfoca el buscador de la página o lleva a /buscar/.
 * Se ignora mientras la persona escribe en un campo.
 */
import { searchUrl } from '@/lib/urls';

document.addEventListener('keydown', (event) => {
  if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) return;
  const target = event.target as HTMLElement | null;
  if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
  event.preventDefault();
  const input = document.querySelector<HTMLInputElement>('[data-search-input]');
  if (input) input.focus();
  else window.location.assign(searchUrl());
});
