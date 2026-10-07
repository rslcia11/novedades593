/**
 * Escena de cada portada. La clave es el nombre del archivo del artículo.
 * Cada escena: sección (define el fondo), color del portal y el sujeto ilustrado.
 */
import { C, pop, portal, sparkles } from './kit.mjs';
import * as P from './props.mjs';

const scene = (theme, portalColor, subject) => ({ theme, portalColor, subject });

export const SCENES = {
  // ---------- Minecraft ----------
  'diamantes-minecraft': scene('juegos', C.cyan, (id) =>
    pop(
      `${id}-s`,
      `${P.cube(560, 560, 120, '#5d6280', '#3b3f5c', '#4a4e6e')}${P.cube(1040, 580, 110, '#5d6280', '#3b3f5c', '#4a4e6e')}${P.pickaxe(1040, 360, 330, 35)}${P.gem(760, 430, 200)}`,
    ),
  ),
  'portal-nether': scene('juegos', C.purple, (id) =>
    pop(`${id}-s`, `${P.blockPortal(800, 450, 130)}${P.flame(1130, 620, 90)}`),
  ),
  'jugar-minecraft-amigos': scene('juegos', C.green, (id) =>
    pop(
      `${id}-s`,
      `${P.cubeHead(560, 470, 130, C.cyan, C.cyanDark)}${P.cubeHead(1060, 470, 130, C.pink, C.pinkDark)}${P.cubeHead(810, 420, 150, C.green, C.greenDark)}${P.waves(810, 250, 160, C.yellow)}`,
    ),
  ),

  // ---------- Roblox ----------
  'codigos-roblox': scene('juegos', C.yellow, (id) =>
    pop(
      `${id}-s`,
      `${P.gift(800, 470, 220, C.purple, C.yellow)}${P.coin(1130, 330, 80)}${P.coin(470, 600, 64)}`,
    ),
  ),
  'proteger-cuenta-roblox': scene('juegos', C.green, (id) =>
    pop(
      `${id}-s`,
      `${P.phone(1080, 470, 210, 380, C.ink, P.lock(1080, 480, 70, C.green))}${P.shield(700, 450, 250)}`,
    ),
  ),
  'robux-gratis-estafas': scene('juegos', C.pink, (id) =>
    pop(`${id}-s`, `${P.hook(760, 360, 150)}${P.coin(760, 640, 95)}${P.warning(1120, 470, 140)}`),
  ),

  // ---------- GTA VI ----------
  'gta-6-todo-lo-que-sabemos': scene('juegos', C.pink, (id) =>
    pop(
      `${id}-s`,
      `${P.palm(520, 780, 520, 6)}${P.palm(1120, 800, 440, -8)}${P.calendar(820, 470, 170, C.pink)}`,
    ),
  ),

  // ---------- Free Fire ----------
  'requisitos-free-fire': scene('juegos', C.orange, (id) =>
    pop(
      `${id}-s`,
      `${P.phone(760, 450, 260, 470, C.ink, P.flame(760, 470, 120))}${P.ram(1110, 560, 260, 110)}`,
    ),
  ),

  // ---------- Fortnite ----------
  'configuracion-fortnite-gama-baja': scene('juegos', C.cyan, (id) =>
    pop(`${id}-s`, `${P.monitor(800, 400, 560, 340, C.ink, P.gauge(800, 470, 170, 0.82, C.pink))}`),
  ),

  // ---------- Equipo ----------
  'internet-para-jugar': scene('equipo', C.cyan, (id) =>
    pop(`${id}-s`, `${P.router(800, 560, 260, C.cyan)}${P.waves(800, 440, 330, C.green)}`),
  ),
  'liberar-espacio-ps5-xbox': scene('equipo', C.purple, (id) =>
    pop(
      `${id}-s`,
      `${P.controller(740, 420, 230, C.purple)}${P.storageBar(800, 690, 620, 70, 0.88)}${P.ssd(1180, 390, 200, 90)}`,
    ),
  ),
  'equipo-stream-basico': scene('equipo', C.yellow, (id) =>
    pop(`${id}-s`, `${P.ringLight(1040, 420, 190)}${P.mic(700, 430, 280)}`),
  ),

  // ---------- Creadores ----------
  'hacer-live-tiktok': scene('creadores', C.pink, (id) =>
    pop(
      `${id}-s`,
      `${P.phone(800, 470, 270, 500, C.purpleDark, `${P.liveBadge(800, 330, 70)}${P.heart(760, 560, 50)}${P.heart(860, 500, 34, C.cyan)}`)}${P.waves(800, 300, 300, C.pink, 2, -160, -20)}`,
    ),
  ),
  'cuanto-paga-tiktok-live': scene('creadores', C.cyan, (id) =>
    pop(
      `${id}-s`,
      `${P.gift(640, 500, 190, C.pink, C.yellow)}${P.gem(1010, 420, 150)}${P.coin(1180, 650, 70)}${P.coin(1040, 690, 55)}`,
    ),
  ),
  'restricciones-tiktok-live': scene('creadores', C.pink, (id) =>
    pop(
      `${id}-s`,
      `${P.phone(720, 470, 260, 480, C.purpleDark, P.liveBadge(720, 360, 64))}${P.ban(1080, 470, 150)}`,
    ),
  ),
  'configurar-obs-stream': scene('creadores', C.purple, (id) =>
    pop(`${id}-s`, `${P.monitor(800, 400, 600, 360, C.ink, P.scenesUi(540, 250, 520, 290))}`),
  ),
  'kick-twitch-tiktok': scene('creadores', C.green, (id) =>
    pop(
      `${id}-s`,
      `${P.playButton(500, 470, 150, C.green)}${P.playButton(1100, 470, 150, C.purple)}${P.playButton(800, 420, 170, C.pink)}`,
    ),
  ),

  // ---------- Noticias ----------
  'gta-6-precarga-precio': scene('noticias', C.yellow, (id) =>
    pop(
      `${id}-s`,
      `${P.controller(640, 520, 200, C.pink)}${P.download(1030, 430, 200, C.green)}${P.palm(1260, 820, 330, -6)}`,
    ),
  ),
  'ffws-latam-2026-gran-final': scene('noticias', C.orange, (id) =>
    pop(`${id}-s`, `${P.flame(560, 560, 130)}${P.flame(1040, 560, 130)}${P.trophy(800, 430, 260)}`),
  ),
  'minecraft-wilderness-bound': scene('noticias', C.green, (id) =>
    pop(
      `${id}-s`,
      `${P.poplar(480, 760, 420)}${P.poplar(1140, 760, 380, C.orange, C.red)}${P.poplar(1290, 780, 300, C.green, C.greenDark)}${P.tent(800, 600, 210)}`,
    ),
  ),
};

/** Composición final: cielo + portal + destellos + sujeto. */
export function compose(slug, kit) {
  const s = SCENES[slug];
  if (!s) throw new Error(`No hay escena para ${slug}`);
  // El sujeto se agranda alrededor del centro: ocupa más cuadro sin salir del área segura.
  const subject = `<g transform="translate(800 450) scale(1.22) translate(-800 -450)">${s.subject(slug)}</g>`;
  return kit.svg(
    `${kit.sky(s.theme, slug)}${portal(800, 450, 390, s.portalColor)}${sparkles(slug, 800, 450, 470)}${subject}`,
  );
}
