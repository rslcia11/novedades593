export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  done: boolean;
}

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function timeLeft(target: Date, now: Date = new Date()): TimeLeft {
  const ms = Math.max(0, target.getTime() - now.getTime());
  return {
    days: Math.floor(ms / DAY),
    hours: Math.floor(ms / HOUR) % 24,
    minutes: Math.floor(ms / MINUTE) % 60,
    done: ms === 0,
  };
}

export const pad2 = (n: number) => String(n).padStart(2, '0');
