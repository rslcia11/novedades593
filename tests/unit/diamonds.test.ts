import { describe, expect, it } from 'vitest';
import {
  INITIAL_BATTLE,
  coinsToDiamonds,
  coinsToUsd,
  diamondsToUsd,
  sanitizeCoins,
  summarizeBattle,
} from '@/lib/tools/diamonds';

describe('calculadora de diamantes', () => {
  it('convierte monedas a diamantes (50 %)', () => {
    expect(coinsToDiamonds(20_000)).toBe(10_000);
    expect(coinsToDiamonds(1)).toBe(0);
    expect(coinsToDiamonds(3)).toBe(1);
  });

  it('convierte diamantes a dólares redondeando a centavos', () => {
    expect(diamondsToUsd(1_000)).toBe(5);
    expect(diamondsToUsd(10_000)).toBe(50);
    expect(diamondsToUsd(3)).toBe(0.02);
    expect(coinsToUsd(20_000)).toBe(50);
  });

  it('trata entradas inválidas como cero', () => {
    for (const value of ['', 'abc', -50, Number.NaN, Infinity, null, undefined]) {
      expect(sanitizeCoins(value)).toBe(0);
    }
    expect(sanitizeCoins('1500.9')).toBe(1500);
    expect(coinsToUsd(-1000)).toBe(0);
  });

  it('resume la batalla inicial', () => {
    const summary = summarizeBattle(INITIAL_BATTLE);
    expect(summary.winning).toBe(true);
    expect(summary.youShare + summary.rivalShare).toBeCloseTo(100);
    expect(summary.youShare).toBeCloseTo((12_400 / 22_200) * 100);
    expect(summary.gapUsd).toBe(6.5);
  });

  it('marca perdiendo cuando el rival va adelante y empate como ganando', () => {
    expect(summarizeBattle({ you: 1_000, rival: 2_000 }).winning).toBe(false);
    expect(summarizeBattle({ you: 1_000, rival: 1_000 }).winning).toBe(true);
  });

  it('no divide entre cero cuando nadie tiene puntos', () => {
    expect(summarizeBattle({ you: 0, rival: 0 })).toEqual({
      winning: true,
      youShare: 50,
      rivalShare: 50,
      gapUsd: 0,
    });
  });
});
