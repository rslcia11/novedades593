/**
 * Espacios de anuncio del sitio.
 *
 * Cada espacio reserva su alto antes de que cargue el anuncio (CLS = 0) y está pensado
 * para servir con AdSense en la fase 1 y con Google Ad Manager en la fase 2 sin rediseñar.
 * Reglas heredadas de la propuesta: etiqueta "Publicidad", nunca pegado a botones,
 * nunca antes del primer párrafo y como máximo 3 o 4 por página.
 */

export type AdPlacement = 'billboard' | 'sidebar' | 'sidebar-tall' | 'in-article';

export interface AdPlacementConfig {
  /** Tamaño de referencia, se muestra en el recuadro de vista previa. */
  label: string;
  /** Alto reservado en computadora y en celular (px). */
  minHeight: { desktop: number; mobile: number };
  /** Solo se muestra en pantallas anchas (por ejemplo, la barra lateral). */
  desktopOnly: boolean;
  /**
   * ID del bloque de anuncios de AdSense (data-ad-slot). Se crea en la cuenta de AdSense.
   * Es obligatorio cuando PUBLIC_ADS_PROVIDER=adsense: el build falla si falta.
   */
  adsenseSlot: string;
  /** Nota que aparece en la vista previa para explicar la ubicación. */
  note?: string;
}

export const AD_PLACEMENTS: Record<AdPlacement, AdPlacementConfig> = {
  billboard: {
    label: '970×250 · 320×100 en celular',
    minHeight: { desktop: 250, mobile: 100 },
    desktopOnly: false,
    adsenseSlot: '',
  },
  sidebar: {
    label: '300×250',
    minHeight: { desktop: 250, mobile: 250 },
    desktopOnly: false,
    adsenseSlot: '',
  },
  'sidebar-tall': {
    label: '300×600',
    minHeight: { desktop: 600, mobile: 600 },
    desktopOnly: true,
    adsenseSlot: '',
    note: 'solo en computadora',
  },
  'in-article': {
    label: '336×280',
    minHeight: { desktop: 280, mobile: 280 },
    desktopOnly: false,
    adsenseSlot: '',
  },
};

export type AdsProvider = 'none' | 'placeholder' | 'adsense';

const ADSENSE_CLIENT = /^ca-pub-\d{16}$/;

/** Valida la configuración de anuncios. Se ejecuta al construir el sitio. */
export function validateAdsConfig(provider: AdsProvider, client: string | undefined): void {
  if (provider !== 'adsense') return;
  if (!client || !ADSENSE_CLIENT.test(client)) {
    throw new Error('PUBLIC_ADSENSE_CLIENT debe tener el formato ca-pub-0000000000000000 para usar AdSense.');
  }
  const missing = Object.entries(AD_PLACEMENTS)
    .filter(([, config]) => !/^\d+$/.test(config.adsenseSlot))
    .map(([placement]) => placement);
  if (missing.length > 0) {
    throw new Error(`Faltan los IDs de bloque de AdSense en src/config/ads.ts: ${missing.join(', ')}.`);
  }
}

/** Línea de ads.txt que autoriza a Google a vender el inventario del sitio. */
export function adsTxtLine(client: string): string {
  const publisherId = client.replace(/^ca-/, '');
  return `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0`;
}
