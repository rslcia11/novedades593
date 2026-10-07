/** Fechas en español de Ecuador y en la hora de Guayaquil, sin depender de la zona del servidor. */
import { SITE } from '@/config/site';

const dateFormat = new Intl.DateTimeFormat(SITE.locale, {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: SITE.timeZone,
});

const shortFormat = new Intl.DateTimeFormat(SITE.locale, {
  day: 'numeric',
  month: 'short',
  timeZone: SITE.timeZone,
});

const timeFormat = new Intl.DateTimeFormat(SITE.locale, {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZone: SITE.timeZone,
});

/** "7 de octubre de 2026" */
export const formatDate = (date: Date) => dateFormat.format(date);

/** "7 oct" */
export const formatShortDate = (date: Date) => shortFormat.format(date).replace('.', '');

/** "09:00" */
export const formatTime = (date: Date) => timeFormat.format(date);

/** Fecha que se muestra al lector: la de actualización si existe. */
export function displayDate(publishedAt: Date, updatedAt?: Date): { label: string; date: Date } {
  return updatedAt
    ? { label: `Actualizado el ${formatDate(updatedAt)}`, date: updatedAt }
    : { label: formatDate(publishedAt), date: publishedAt };
}
