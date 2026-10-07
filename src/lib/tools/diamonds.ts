/**
 * Cuentas de TikTok LIVE. Son valores aproximados: TikTok no publica una tasa oficial
 * y puede cambiar por país. Si cambian, se actualizan aquí y en el texto de la herramienta.
 */

/** Parte del valor del regalo que llega al creador como diamantes. */
export const CREATOR_SHARE = 0.5;
/** Valor aproximado de un diamante en dólares. */
export const USD_PER_DIAMOND = 0.005;

/** Normaliza lo que escribe la persona: vacío, negativo o texto cuentan como 0. */
export function sanitizeCoins(value: unknown): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

export function coinsToDiamonds(coins: number): number {
  return Math.floor(sanitizeCoins(coins) * CREATOR_SHARE);
}

export function diamondsToUsd(diamonds: number): number {
  return Math.round(Math.max(0, diamonds) * USD_PER_DIAMOND * 100) / 100;
}

export function coinsToUsd(coins: number): number {
  return diamondsToUsd(coinsToDiamonds(coins));
}

export interface BattleScore {
  you: number;
  rival: number;
}

export const INITIAL_BATTLE: BattleScore = { you: 12_400, rival: 9_800 };
export const BATTLE_STEP = 1_000;

export interface BattleSummary {
  winning: boolean;
  /** Porcentaje de la barra para cada lado (suman 100). */
  youShare: number;
  rivalShare: number;
  /** Diferencia, en dólares, de lo que recibe el creador. */
  gapUsd: number;
}

export function summarizeBattle({ you, rival }: BattleScore): BattleSummary {
  const total = you + rival;
  const youShare = total > 0 ? (you / total) * 100 : 50;
  return {
    winning: you >= rival,
    youShare,
    rivalShare: 100 - youShare,
    gapUsd: coinsToUsd(Math.abs(you - rival)),
  };
}
