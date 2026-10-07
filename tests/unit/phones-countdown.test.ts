import { describe, expect, it } from 'vitest';
import { BUDGETS, PHONE_GAMES, isBudget, isPhoneGame, recommendPhone } from '@/lib/tools/phones';
import { pad2, timeLeft } from '@/lib/tools/countdown';

describe('recomendador de celular', () => {
  it('da una recomendación para cada combinación que menciona el juego', () => {
    for (const game of PHONE_GAMES) {
      for (const budget of BUDGETS) {
        const reco = recommendPhone(game, budget.id);
        expect(reco.tier).toBeTruthy();
        expect(reco.advice).toContain(game);
      }
    }
  });

  it('sube de gama con el presupuesto', () => {
    expect(recommendPhone('Roblox', 'low').tier).toBe('Gama de entrada');
    expect(recommendPhone('Roblox', 'mid').tier).toBe('Gama media');
    expect(recommendPhone('Roblox', 'high').tier).toBe('Gama media alta');
  });

  it('valida los valores que llegan desde el HTML', () => {
    expect(isPhoneGame('Free Fire')).toBe(true);
    expect(isPhoneGame('Tetris')).toBe(false);
    expect(isPhoneGame(undefined)).toBe(false);
    expect(isBudget('mid')).toBe(true);
    expect(isBudget('gratis')).toBe(false);
  });
});

describe('cuenta regresiva', () => {
  const target = new Date('2026-11-19T00:00:00-05:00');

  it('calcula días, horas y minutos', () => {
    const now = new Date('2026-10-07T12:30:00-05:00');
    expect(timeLeft(target, now)).toEqual({ days: 42, hours: 11, minutes: 30, done: false });
  });

  it('se queda en cero cuando ya pasó la fecha', () => {
    expect(timeLeft(target, new Date('2026-12-01T00:00:00Z'))).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      done: true,
    });
  });

  it('rellena con cero a la izquierda', () => {
    expect(pad2(5)).toBe('05');
    expect(pad2(42)).toBe('42');
  });
});
