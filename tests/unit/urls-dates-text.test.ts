import { describe, expect, it } from 'vitest';
import { absoluteUrl, articleUrl, gameUrl, searchUrl, sectionUrl, toolUrl } from '@/lib/urls';
import { displayDate, formatDate, formatShortDate, formatTime } from '@/lib/dates';
import { countWords, readingMinutes } from '@/lib/reading-time';
import { formatNumber, formatUsd, plural } from '@/lib/format';

describe('URLs', () => {
  it('cuelga las guías de juegos de su juego y el resto de su sección', () => {
    expect(articleUrl({ id: 'diamantes', section: 'juegos', game: 'minecraft' })).toBe(
      '/juegos/minecraft/diamantes/',
    );
    expect(articleUrl({ id: 'obs', section: 'creadores' })).toBe('/creadores/obs/');
    expect(articleUrl({ id: 'pc', section: 'equipo', game: 'gta6' })).toBe('/equipo/pc/');
  });

  it('falla si una guía de juegos no tiene juego', () => {
    expect(() => articleUrl({ id: 'x', section: 'juegos' })).toThrow(/no tiene juego/);
  });

  it('siempre termina en barra', () => {
    for (const url of [sectionUrl('juegos'), gameUrl('roblox'), toolUrl('nombres'), searchUrl()]) {
      expect(url.endsWith('/')).toBe(true);
    }
  });

  it('codifica la búsqueda', () => {
    expect(searchUrl('free fire & más')).toBe('/buscar/?q=free%20fire%20%26%20m%C3%A1s');
  });

  it('arma URLs absolutas con el dominio del sitio', () => {
    expect(absoluteUrl('/juegos/', 'https://ejemplo.com')).toBe('https://ejemplo.com/juegos/');
    expect(() => absoluteUrl('/', undefined)).toThrow();
  });
});

describe('fechas en hora de Ecuador', () => {
  // 03:30 UTC del 8 de octubre son las 22:30 del 7 de octubre en Guayaquil.
  const late = new Date('2026-10-08T03:30:00Z');

  it('formatea en español y en la zona de Guayaquil', () => {
    expect(formatDate(late)).toBe('7 de octubre de 2026');
    expect(formatShortDate(late)).toBe('7 oct');
    expect(formatTime(late)).toBe('22:30');
  });

  it('muestra la fecha de actualización cuando existe', () => {
    const published = new Date('2026-09-01T12:00:00-05:00');
    expect(displayDate(published).label).toBe('1 de septiembre de 2026');
    expect(displayDate(published, late)).toEqual({
      label: 'Actualizado el 7 de octubre de 2026',
      date: late,
    });
  });
});

describe('tiempo de lectura', () => {
  it('cuenta palabras sin etiquetas ni atributos', () => {
    expect(countWords('<Step title="no cuenta">Hola mundo</Step>\n\n## Título')).toBe(3);
  });

  it('nunca baja de 1 minuto y redondea a 200 palabras por minuto', () => {
    expect(readingMinutes('')).toBe(1);
    expect(readingMinutes('palabra '.repeat(1000))).toBe(5);
  });
});

describe('formato de números', () => {
  it('usa punto de miles y coma decimal', () => {
    expect(formatNumber(20000)).toBe('20.000');
    expect(formatUsd(50)).toMatch(/50,00/);
    expect(plural(1, 'artículo')).toBe('1 artículo');
    expect(plural(3, 'artículo')).toBe('3 artículos');
  });
});
