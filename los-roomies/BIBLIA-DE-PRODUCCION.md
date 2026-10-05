# LOS ROOMIES · Biblia de producción

> Documento de traspaso: con esto, una sesión nueva sigue exactamente donde quedamos.
> Última actualización: 5 de octubre de 2026.

## 1. La serie
- **Formato:** sitcom animado en 3D, vertical 9:16, para TikTok, Reels y Shorts. Capítulos de unos 90 segundos (más de 1 minuto, el mínimo para los pagos de TikTok). Cada 5 capítulos, una recopilación larga para YouTube y Facebook.
- **Premisa:** cinco latinos de distintos países comparten un departamento pequeño en una ciudad grande. Comedia por el choque de culturas, drama por el dinero.
- **Estructura:** capítulos que se entienden solos, con una trama de fondo por temporada.
- **Trama de fondo de la temporada 1:** Doña Chabela sube el arriendo al doble. Cada capítulo es un plan loco para conseguir la plata.
- **Regla de tono:** los estereotipos siempre con cariño, nunca para burlarse.

## 2. Estilo visual (decisión fija)
- **3D estilizado de película animada**, igual a las fichas de `referencias/`. No 2D, no ilustración, no fotorrealista.
- Personajes adultos (no infantiles). La IA tiende a hacerlos niños o a dibujarlos en 2D, así que hay que prohibirlo siempre en el prompt.
- **Sin escudos, logos ni letras** en ropa ni objetos (la camiseta de Bryan es amarilla con el 10, sin escudo).

## 3. Personajes (fichas aprobadas en `referencias/`)
| Personaje | País | Descripción para prompts | Voz |
|---|---|---|---|
| **Bryan** | Ecuador (Guayaquil) | 28 años, piel trigueña, pelo negro corto con degradado y un rulo en la frente, barba de 3 días, delgado con algo de pancita, camiseta amarilla con el 10 (sin escudo), jean oscuro, zapatillas blancas | Alegre, rápido, acento costeño ecuatoriano. Dice "chuta", "ñaño", "pana", "de ley" |
| **Pancho** | México (CDMX) | 32 años, gordito, bigote negro grueso, pelo negro despeinado, buzo verde con capucha, pantalón gris de buzo, medias blancas con sandalias | Grave, relajado, acento chilango. Dice "no manches", "ahorita", "wey" |
| **Facu** | Argentina (Buenos Aires) | 29 años, alto y flaco, pelo castaño claro ondulado hasta los hombros, barba ligera, camisa a rayas celestes y blancas, pantalón beige, mocasines, siempre con mate | Seguro, dramático, acento porteño. Dice "che", "mirá" |
| **Vale** | Colombia (Medellín) | 26 años, delgada, pelo castaño oscuro ondulado en cola de caballo alta, argollas doradas grandes, chaqueta rosada sobre top blanco, jean celeste, zapatillas blancas, siempre con su celular | Dulce y enérgica, acento paisa. Dice "amores", "parce" |
| **Doña Chabela** | Perú (Lima) | 65 años, bajita y gruesa, moño gris único arriba, lentes redondos (SIN cadena), cárdigan morado sobre blusa floreada, falda oscura, libreta y lapicero | Lenta, ronca, teatral, acento limeño. Dice "causita", "ya pe" |
| **Lorenzo** | — (loro) | Loro verde brillante, parche amarillo en la cabeza, plumas rojas en las alas, pico gris | Chillón, de loro |

**Archivos:** `bryan.png`, `pancho.jpg`, `facu.png`, `vale.png`, `dona-chabela.png`, `lorenzo.jpg`.
Nota: varias son capturas de pantalla de baja resolución. Pedirle al usuario los archivos originales para la producción.

## 4. Escenario (`referencias/sala-3d.jpg`)
Sala pequeña latinoamericana en 3D: paredes turquesa, puerta de madera a la izquierda, sofá naranja forrado en plástico, mesa de centro con tazón de fruta, repisa con lata de galletas azul, calendario, luces colgantes, ventana a la derecha con techos, tanques de agua y ropa tendida, soporte de madera para el loro, tele vieja con tapete tejido, ventilador de pie, plantas en baldes de pintura, luz dorada de tarde.
**Queda fija para todo el capítulo 1** (por continuidad, aunque el tazón tenga guineos amarillos).

## 5. Lo que aprendimos (reglas obligatorias)
1. **Primero las imágenes, después el video.** Cada toma: imagen inicial con las referencias oficiales → revisión → animación.
2. **Nunca encadenar** (usar el último cuadro de una toma como inicio de la siguiente): acumula errores. Cada imagen inicial se crea desde cero con la Sala-3D y las fichas.
3. **Un solo movimiento simple por toma.** La IA falla con objetos que se rompen, cosas que salen de adentro de otras o varias acciones seguidas. La comedia va en los diálogos y las caras.
4. **Casi siempre 1 personaje por toma** (plano de quien habla, luego plano de quien reacciona). Máximo 3 en tomas grupales.
5. **Tomas cortas: 4–6 s.** Un capítulo de 90 s son unas 18–20 tomas (así lo hace Fruit Love Island: 20–25 tomas por episodio de 2 min).
6. **Identificar cada imagen adjunta por cómo se ve**, no por su orden ("el hombre de la camiseta amarilla es Bryan"). La IA no respeta "primera/segunda imagen".
7. **Accesorios pequeños colgantes = problemas** (por eso Doña Chabela no tiene cadena).
8. **Escena en inglés, diálogo en español con el acento indicado.** Las voces de Veo salieron bien.
9. Siempre terminar con: "No subtitles, no text on screen. Vertical 9:16."

### Revisión de 5 puntos antes de aprobar cualquier imagen
1. ¿Es 3D como las fichas? 2. ¿Caras, pelo y ropa iguales a las fichas? 3. ¿Escudos, logos o letras? 4. ¿Personajes o animales de más? 5. ¿Objetos correctos (plátanos verdes, etc.)?

## 6. Producción por API (cómo trabaja la sesión nueva)
- **Clave:** variable de entorno `GEMINI_API_KEY` (Gemini API de Google AI Studio, con facturación activada). Nunca pedirla por el chat.
- **Imágenes iniciales:** modelo de imagen de Gemini (Nano Banana), adjuntando Sala-3D + fichas de los personajes de esa toma.
- **Video:** Veo 3.1 Fast, imagen a video, 9:16. Costo aprox. $0,12/s en 1080p.
- **Montaje:** ffmpeg en el entorno (une las tomas y exporta MP4 1080×1920).
- **Flujo:** generar imagen → Claude la revisa con los 5 puntos (y la repite si falla) → animar → revisar → unir → entregar MP4 al usuario.
- Antes de gastar, confirmar con el usuario el presupuesto del capítulo.

## 7. Capítulo 1 "El Nuevo" · Lista de tomas (19 tomas, ~95 s)
| # | Plano | Personajes | Acción (un solo movimiento) | Diálogo |
|---|---|---|---|---|
| 1 | General de la sala | Bryan | Abre la puerta y entra con una maleta vieja amarrada con soga | **Bryan:** "¡Llegué, ñaños!" |
| 2 | Medio, sofá | Facu, Pancho | Voltean la cabeza sorprendidos hacia la puerta | — |
| 3 | Medio | Bryan | Pone la maleta en el piso y la abre: está llena de plátanos verdes, sin ropa | **Bryan:** "Traje lo más importante." |
| 4 | Primer plano | Facu | Levanta una ceja | **Facu:** "¿Y la ropa, che?" |
| 5 | Primer plano | Bryan | Se ofende | **Bryan:** "¿Qué ropa? ¡Esto es plátano verde, pana!" |
| 6 | Medio | Pancho | Golpea un plátano en la palma como garrote | **Pancho:** "No manches… ¿esto se come o es arma?" |
| 7 | Medio | Bryan | Lo dice orgulloso | **Bryan:** "¡Se come! Bolón, chifle, patacón…" |
| 8 | Medio, junto a la puerta | Vale | En vivo con el celular, muestra un plátano | **Vale:** "¡Amores, plátano importado de Ecuador, solo por hoy!" |
| 9 | Primer plano | Bryan | Mira a cámara, confundido | — |
| 10 | Medio, sofá | Facu | Da palmaditas al sofá con plástico | **Facu:** "Y tu cuarto… es este sofá." |
| 11 | Primer plano | Bryan | Cara de incredulidad | **Bryan:** "¿El del plástico?" |
| 12 | Contrapicado, puerta | Doña Chabela | Entra y se baja los lentes | **Chabela:** "A ver, causitas…" |
| 13 | Primer plano | Doña Chabela | Golpea la libreta con el lapicero | **Chabela:** "…desde el lunes el arriendo sube… ¡el doble!" (golpe musical de telenovela) |
| 14 | Medio, grupo | Bryan, Pancho, Vale | Quedan en shock, boca abierta | — |
| 15 | Medio, ventana | Lorenzo | Aletea | **Lorenzo:** "¡El doble! ¡El doble!" |
| 16 | Medio, sofá | Bryan | Pela un plátano con calma | **Bryan:** "Tranquilos. Yo tengo un plan." |
| 17 | Primer plano | Pancho | Lo mira preocupado | **Pancho:** "¿Con plátanos?" |
| 18 | Primer plano | Bryan | Sonrisa confiada | **Bryan:** "…Con plátanos." |
| 19 | Primer plano, ventana al atardecer | Lorenzo | Infla el pecho y aletea | **Lorenzo:** "¡Síguelos! ¡Síguelos!" |

**Montaje:** subtítulos grandes en español, cartel final "Cap. 2: El bolón millonario", logo de Los Roomies, etiqueta de contenido con IA al publicar.

## 8. Próximos capítulos (ideas)
"El bolón millonario", "La mamá colombiana llega de visita", "Clásico Argentina vs. México en la sala", "Vale vende el sofá por live", "El loro se volvió viral". Fórmula: costumbre típica × choque entre países × plan para pagar el arriendo.
