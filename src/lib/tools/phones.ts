/** Recomendador de celular: qué buscar según el juego y el presupuesto. */

export const PHONE_GAMES = ['Free Fire', 'Roblox', 'Minecraft', 'Fortnite'] as const;
export type PhoneGame = (typeof PHONE_GAMES)[number];

export const BUDGETS = [
  { id: 'low', label: 'Menos de $150' },
  { id: 'mid', label: '$150 a $300' },
  { id: 'high', label: 'Más de $300' },
] as const;
export type Budget = (typeof BUDGETS)[number]['id'];

export const DEFAULT_PHONE_GAME: PhoneGame = 'Free Fire';
export const DEFAULT_BUDGET: Budget = 'mid';

export interface PhoneRecommendation {
  tier: string;
  advice: string;
}

export function recommendPhone(game: PhoneGame, budget: Budget): PhoneRecommendation {
  switch (budget) {
    case 'low':
      return {
        tier: 'Gama de entrada',
        advice: `Busca 6 GB de RAM y 5.000 mAh de batería. ${game} corre en gráficos bajos o medios.`,
      };
    case 'mid':
      return {
        tier: 'Gama media',
        advice: `Busca 8 GB de RAM y pantalla de 90 o 120 Hz. ${game} corre fluido en gráficos altos.`,
      };
    case 'high':
      return {
        tier: 'Gama media alta',
        advice: `Busca 8 GB de RAM o más, 120 Hz y buena cámara frontal: te sirve también para hacer lives de ${game}.`,
      };
  }
}

export function isPhoneGame(value: string | undefined): value is PhoneGame {
  return (PHONE_GAMES as readonly string[]).includes(value ?? '');
}

export function isBudget(value: string | undefined): value is Budget {
  return BUDGETS.some((b) => b.id === value);
}
