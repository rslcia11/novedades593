/** Busca un elemento que el componente necesita; si falta, falla con un mensaje claro en vez de un error genérico. */
export function required<T extends Element = HTMLElement>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Falta el elemento ${selector}`);
  return element;
}
