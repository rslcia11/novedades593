import { SITE } from '@/config/site';

const integer = new Intl.NumberFormat(SITE.locale, { maximumFractionDigits: 0 });
const usd = new Intl.NumberFormat(SITE.locale, { style: 'currency', currency: 'USD' });

/** "20.000" */
export const formatNumber = (value: number) => integer.format(value);

/** "$50,00" */
export const formatUsd = (value: number) => usd.format(value);

/** "1 artículo" / "3 artículos" */
export const plural = (count: number, singular: string, pluralForm = `${singular}s`) =>
  `${formatNumber(count)} ${count === 1 ? singular : pluralForm}`;
