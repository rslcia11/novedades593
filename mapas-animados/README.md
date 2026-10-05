# Mapas animados con código · Guía completa

> Fábrica de videos verticales de historia y mapas, hecha con Python.
> Demo actual: **"Cómo cambió el mapa de Sudamérica"** (30 s, 1080×1920, sin voz ni música).
> Última actualización: 5 de octubre de 2026.

---

## 1. Qué hace

1. Descarga fronteras históricas reales (GeoJSON) de varios años.
2. Dibuja un mapa por año, con colores y nombres en español (`render_maps.py`).
3. Arma el video: transición suave entre mapas, año que va contando, textos por etapa, círculos que marcan lo importante y un zoom lento (`compose.py`).
4. Exporta MP4 vertical listo para TikTok, Reels y Shorts.

**Ventajas:** el código siempre da el mismo resultado (consistencia perfecta), no gasta créditos de IA y para hacer otro video basta con cambiar los datos.

---

## 2. Cómo correrlo

### Requisitos
- Python 3.10 o superior
- `ffmpeg` instalado
- La fuente DejaVu Sans (viene en casi todo Linux; en Windows o Mac, cambia la ruta en `compose.py`)

```bash
pip install matplotlib shapely pillow numpy
./descargar_datos.sh        # baja los mapas históricos
python3 render_maps.py      # crea map_1800.png ... map_2010.png
python3 compose.py          # crea demo_sudamerica.mp4
```

Tarda unos 2 minutos en una computadora normal.

---

## 3. El código

### `descargar_datos.sh`
```bash
#!/usr/bin/env bash
# Descarga las fronteras históricas (GeoJSON) que usa el video.
set -e
for y in 1800 1815 1880 1914 2010; do
  curl -sSL -o "world_$y.geojson" \
    "https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_$y.geojson"
  echo "descargado world_$y.geojson"
done
```

### `render_maps.py` (dibuja un mapa por año)
```python
import json, matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon as MPoly
from shapely.geometry import shape, box

BOX = box(-84, -57, -32, 14)
W, H = 1080, 1920
# encuadre del mapa (longitud/latitud)
LON0, LON1, LAT0, LAT1 = -84, -32, -57, 14

NAMES = {
 1800: {"Viceroyalty of New Granada":"Virreinato de\nNueva Granada","Viceroyalty of Peru":"Virreinato\ndel Perú",
        "Viceroyalty of the Río de la Plata":"Virreinato del\nRío de la Plata","Viceroyalty of Brazil":"Brasil\n(Portugal)",
        "Paraguay":"Paraguay","Pampas cultures":"Pueblos\nindígenas","Patagonian shellfish and marine mammal hunters":"Pueblos\nindígenas",
        "Shuar":"","British Guiana":"","United Kingdom":"","Viceroyalty of New Spain":""},
 1815: {"Viceroyalty of New Granada":"Virreinato de\nNueva Granada","Viceroyalty of Peru":"Virreinato\ndel Perú",
        "United Provinces of the Río de la Plata":"Provincias Unidas\ndel Río de la Plata","Viceroyalty of Brazil":"Brasil\n(Portugal)",
        "Paraguay":"Paraguay","Pampas cultures":"Pueblos\nindígenas","Patagonian shellfish and marine mammal hunters":"Pueblos\nindígenas",
        "Shuar":"","Guiana":"","United Kingdom":"","Viceroyalty of New Spain":""},
}
MODERN = {"Argentina":"Argentina","Bolivia":"Bolivia","Brazil":"Brasil","Kingdom of Brazil":"Imperio\ndel Brasil","Chile":"Chile",
          "Colombia":"Colombia","Ecuador":"Ecuador","Paraguay":"Paraguay","Peru":"Perú","Uruguay":"Uruguay","Venezuela":"Venezuela",
          "Guyana":"","Suriname":"","French Guiana":"","British Guiana":"","Dutch Guiana":"","Panama":"","Costa Rica":"","Nicaragua":"",
          "United Kingdom of Great Britain and Ireland":""}
COLORS = {
 "Viceroyalty of New Granada":"#E07A5F","Viceroyalty of Peru":"#D4A373","Viceroyalty of the Río de la Plata":"#E9C46A",
 "United Provinces of the Río de la Plata":"#8AB6D6","Viceroyalty of Brazil":"#81B29A","Paraguay":"#B5838D",
 "Argentina":"#8AB6D6","Bolivia":"#F4A261","Brazil":"#81B29A","Kingdom of Brazil":"#81B29A","Chile":"#E76F51","Colombia":"#F2CC8F",
 "Ecuador":"#FFD166","Peru":"#D4A373","Uruguay":"#A8DADC","Venezuela":"#E07A5F",
}
DEFAULT = "#C9C2B2"; INDIG = "#E8DFC9"
OCEAN = "#0E1E2B"
COLONIAL = [("Virreinato de\nNueva Granada",-69.5,5.0,22,0,0),("Virreinato\ndel Perú",-71.5,-11,22,0,0),
            ("Brasil\n(Portugal)",-50,-9,30,0,0),("Paraguay",-58.3,-23.2,15,0,0),("Pueblos\nindígenas",-69.3,-45.5,14,0,0)]
MOD = [("Colombia",-73.3,4.3,22,0,0),("Venezuela",-65.5,7.3,20,0,0),("Ecuador",-78.2,-1.7,14,0,0),("Perú",-75,-9.5,22,0,0),
       ("Bolivia",-64.8,-17,22,0,0),("Paraguay",-58.3,-23.2,15,0,0),("Argentina",-65,-35,26,0,0),("Uruguay",-55.9,-32.8,12,0,0),
       ("Chile",-78.5,-33,24,1,90)]
LABELS = {
 1800: COLONIAL+[("Virreinato del\nRío de la Plata",-63.5,-31,20,0,0)],
 1815: COLONIAL+[("Provincias Unidas\ndel Río de la Plata",-63.5,-31,17,0,0)],
 1880: MOD+[("Imperio\ndel Brasil",-50,-9,28,0,0)],
 1914: MOD+[("Brasil",-50,-9,30,0,0)],
 2010: MOD+[("Brasil",-50,-9,30,0,0)],
}

def draw(year, out):
    d = json.load(open(f"world_{year}.geojson"))
    fig = plt.figure(figsize=(W/100, H/100), dpi=100)
    ax = fig.add_axes([0,0,1,1]); ax.set_facecolor(OCEAN); fig.patch.set_facecolor(OCEAN)
    # el mapa ocupa de y=300 a y=1760 px
    top, bot = 300, 1760
    h_px = bot - top
    scale = h_px / (LAT1 - LAT0)
    w_px = (LON1 - LON0) * scale
    x_off = (W - w_px) / 2
    def proj(lon, lat):
        return x_off + (lon - LON0) * scale, H - (top + (LAT1 - lat) * scale)
    ax.set_xlim(0, W); ax.set_ylim(0, H); ax.axis("off")
    labels = []
    for f in d["features"]:
        try: g = shape(f["geometry"]).buffer(0)
        except Exception: continue
        if not g.intersects(BOX): continue
        g = g.intersection(BOX).simplify(0.03)
        if g.is_empty: continue
        n = f["properties"].get("NAME") or ""
        col = COLORS.get(n, INDIG if ("cultures" in n or "hunters" in n or n=="Shuar") else DEFAULT)
        polys = [g] if g.geom_type == "Polygon" else [p for p in getattr(g, "geoms", []) if p.geom_type == "Polygon"]
        for p in polys:
            xy = [proj(x, y) for x, y in p.exterior.coords]
            ax.add_patch(MPoly(xy, closed=True, fc=col, ec="#1B2B38", lw=1.6))
    for (lab, lon, lat, fs, white, rot) in LABELS[year]:
        x, y = proj(lon, lat)
        ax.text(x, y, lab, ha="center", va="center", fontsize=fs, fontweight="bold",
                color="#F4F1EA" if white else "#14212B", rotation=rot,
                fontfamily="DejaVu Sans", linespacing=1.0)
    fig.savefig(out, dpi=100, facecolor=OCEAN); plt.close(fig)

for y in [1800, 1815, 1880, 1914, 2010]:
    draw(y, f"map_{y}.png"); print("ok", y)
```

### `compose.py` (arma el video)
```python
import numpy as np, subprocess, math
from PIL import Image, ImageDraw, ImageFont
W,H,FPS,DUR = 1080,1920,30,30
B="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
F=lambda s: ImageFont.truetype(B,s)
maps={y:np.asarray(Image.open(f"map_{y}.png").convert("RGB")).astype(np.float32) for y in [1800,1815,1880,1914,2010]}
# (año, segundo en que empieza la transición hacia ese mapa); cada transición dura 1 s
segs=[(1800,0),(1815,9),(1880,14),(1914,21),(2010,26)]
LON0,LAT1=-84,14; top,bot=300,1760; scale=(bot-top)/71; x_off=(W-52*scale)/2
proj=lambda lon,lat:(x_off+(lon-LON0)*scale, top+(LAT1-lat)*scale)
caps=[(3,8,"1800: casi todo era de\nEspaña y Portugal"),
      (9.3,13,"1810–1825: estallan\nlas independencias"),
      (14.3,20,"1830: la Gran Colombia se divide\nen Colombia, Venezuela y Ecuador"),
      (21.3,25,"1884: Bolivia pierde su salida\nal mar en la Guerra del Pacífico"),
      (26.3,30,"Hoy son 12 países.\n¿Cuál es el tuyo? Coméntalo")]
rings=[(14.3,20,proj(-78.3,-1.6),"#FFD166"),(21.3,25,proj(-70.3,-22.5),"#FF5A5F")]
def frame_map(t):
    cur=segs[0]
    for i,(y,ts) in enumerate(segs):
        if t>=ts: cur=i
    y,ts=segs[cur]
    if cur>0 and t<ts+1:
        a=(t-ts); a=a*a*(3-2*a)
        img=maps[segs[cur-1][0]]*(1-a)+maps[y]*a
        yr=round(segs[cur-1][0]+(y-segs[cur-1][0])*a)
    else:
        img=maps[y]; yr=y
    return Image.fromarray(img.astype(np.uint8)), yr
def text_box(d,xy,txt,font,fill,bg,pad=22,anchor="mm",radius=18):
    bb=d.multiline_textbbox(xy,txt,font=font,anchor=anchor,align="center",spacing=10)
    d.rounded_rectangle([bb[0]-pad,bb[1]-pad,bb[2]+pad,bb[3]+pad],radius=radius,fill=bg)
    d.multiline_text(xy,txt,font=font,fill=fill,anchor=anchor,align="center",spacing=10)
ff=subprocess.Popen(["ffmpeg","-y","-loglevel","error","-f","rawvideo","-pix_fmt","rgb24","-s",f"{W}x{H}","-r",str(FPS),"-i","-",
   "-c:v","libx264","-pix_fmt","yuv420p","-crf","18","-preset","medium","demo_sudamerica.mp4"],stdin=subprocess.PIPE)
for n in range(FPS*DUR):
    t=n/FPS
    im,yr=frame_map(t)
    z=1+0.03*t/DUR  # slow zoom
    cw,ch=int(W/z),int(H/z); im=im.crop(((W-cw)//2,(H-ch)//2,(W-cw)//2+cw,(H-ch)//2+ch)).resize((W,H),Image.BICUBIC)
    d=ImageDraw.Draw(im)
    for (a,b,(x,y),col) in rings:
        if a<=t<b:
            x=W/2+(x-W/2)*z; y=H/2+(y-H/2)*z
            r=55+10*math.sin((t-a)*6)
            d.ellipse([x-r,y-r,x+r,y+r],outline=col,width=8)
    d.text((W/2,120),("HOY" if yr==2010 else str(yr)),font=F(120),fill="#FFD166",anchor="mm")
    if t<3:
        text_box(d,(W/2,262),"Hace 200 años, Ecuador\nno existía como país",F(50),"#FFFFFF","#C1121F",pad=16)
    for a,b,txt in caps:
        if a<=t<b:
            text_box(d,(W/2,1745),txt,F(46),"#14212B","#F4F1EA")
    d.text((W/2,1880),"Mapas: historical-basemaps · fronteras aproximadas",font=F(22),fill="#7F8C99",anchor="mm")
    ff.stdin.write(im.tobytes())
ff.stdin.close(); ff.wait(); print("done")
```

### Cómo se ajusta
| Quiero cambiar… | Dónde |
|---|---|
| Colores de cada país | `COLORS` en `render_maps.py` |
| Nombres y posición de las etiquetas | `LABELS` en `render_maps.py` (nombre, longitud, latitud, tamaño, texto blanco sí/no, rotación) |
| Años y momento de cada transición | `segs` en `compose.py` |
| Textos de cada etapa | `caps` en `compose.py` (segundo de inicio, segundo de fin, texto) |
| Círculos que marcan zonas | `rings` en `compose.py` (inicio, fin, posición, color) |
| Duración total | `DUR` en `compose.py` |
| Gancho del inicio | el bloque `if t<3:` en `compose.py` |

---

## 4. Lo que falta para publicar (en orden)

### 4.1 Voz en off (obligatorio)
Sin voz, el video es "texto e imágenes": justo lo que YouTube y Meta no monetizan. Opciones:

| Opción | Costo | Comentario |
|---|---|---|
| **Tu propia voz** | $0 | La mejor para monetizar, porque es aporte humano real |
| **ElevenLabs Starter** | $5/mes | Voces muy naturales en español y derechos comerciales. Puedes clonar tu voz sin salir en cámara |
| **TTS de Google (Gemini API)** | Pago por uso | Se puede automatizar desde el código |

**Cambio en el código:** que la duración de cada etapa la mande el audio, no un número fijo. Se genera un audio por etapa, se mide su duración y con eso se arma `segs` y `caps`. Así la voz y el mapa quedan siempre sincronizados.

### 4.2 Música y efectos
- **Música:** Biblioteca de audio de YouTube (gratis y libre de derechos). En TikTok conviene agregar un sonido en tendencia desde la app, a volumen bajo.
- **Efectos:** un "whoosh" en cada transición y un "pop" cuando aparece cada texto. Se mezclan con ffmpeg (`-filter_complex amix`).

### 4.3 Duración de 60 a 90 segundos
TikTok solo paga videos de más de 1 minuto. Para alargar con contenido de verdad:
- Más etapas: 1830 (separación de la Gran Colombia), 1879 (antes de la Guerra del Pacífico), 1942 (Ecuador y Perú). Los datos de esos años no vienen en la base, así que hay que dibujarlos a mano o buscar otra fuente.
- Un dato curioso por etapa, con su fuente.
- Cierre con pregunta para generar comentarios.

### 4.4 Subtítulos sincronizados con la voz
Palabra por palabra (estilo TikTok), resaltando la palabra que se dice. Con la voz generada por TTS se obtienen los tiempos exactos; con tu voz, se sacan con Whisper (reconocimiento de voz gratis y local).

---

## 5. Mejoras técnicas (para que se vea profesional)

1. **Resaltar automáticamente lo que cambió.** Con `shapely` se calcula la diferencia entre el mapa de un año y el siguiente (`symmetric_difference`) y esa zona parpadea en color durante la transición. Así nadie se pierde el cambio.
2. **Etiquetas que aparecen y desaparecen con fundido**, en vez de cambiar de golpe con el mapa.
3. **Zoom dirigido:** que la cámara se acerque a la zona de la que habla el texto (por ejemplo, Ecuador en 1830) y luego vuelva a la vista completa.
4. **Textos con animación:** que entren deslizándose o letra por letra.
5. **Cada video en un archivo de configuración.** Pasar `segs`, `caps`, `rings` y `LABELS` a un archivo JSON por episodio. Hacer un video nuevo = escribir un JSON nuevo, sin tocar el código.
6. **Versión horizontal 16:9** con el mismo código para YouTube largo (recopilaciones de 8–15 min).
7. **Generador de miniaturas** para YouTube: mapa + año grande + frase gancho.
8. **Marca del canal:** logo pequeño en una esquina, paleta de colores fija y la misma tipografía en todos los videos.
9. **Ilustraciones con IA entre mapas** (por ejemplo, un retrato de Bolívar o una batalla) para dar variedad. Son imágenes sueltas, así que no hay problema de consistencia.
10. **Etiquetas automáticas:** colocar los nombres sin coordenadas a mano (punto representativo del polígono más grande), y a mano solo los casos difíciles como Chile o Ecuador.

---

## 6. Calidad de datos y derechos

- Las fronteras vienen de **historical-basemaps** (Andre Ourednik). Son **aproximadas**: el propio proyecto lo advierte. Mantén el crédito en el video y revisa la licencia del repositorio antes de monetizar.
- La base tiene detalles a corregir con nombres propios: en 1880 llama "Kingdom of Brazil" a lo que era el **Imperio del Brasil** (ya corregido en las etiquetas), y en 1914 usa "Guyana" y "Suriname", que entonces eran colonias.
- **Revisa cada dato antes de publicar** y pon las fuentes en la descripción. En historia, la audiencia corrige en los comentarios.
- Datos de esta demo, verificados: Ecuador nace como Estado en 1830, al separarse de la Gran Colombia; Bolivia pierde su litoral en la Guerra del Pacífico (1879–1884); Sudamérica tiene 12 países independientes.

---

## 7. Reglas para no perder la monetización

- **Nunca publicar solo mapas con texto:** siempre voz, guion propio y datos con fuente.
- Si usas voz de IA realista, márcalo como contenido con IA al publicar.
- Varía el formato entre videos (gancho, duración, tipo de cierre) para que no parezca producción en masa.
- Un canal fuerte por red, no muchos canales iguales.

---

## 8. Primeros 10 temas (mismo código, otros datos)

1. Cómo cambió el mapa de Sudamérica (esta demo, versión completa)
2. Así se separó la Gran Colombia
3. La Guerra del Pacífico explicada en un mapa
4. El conflicto Ecuador–Perú en 60 segundos
5. Centroamérica: de una república a cinco países
6. El Imperio inca en su máxima extensión
7. Dónde se habla español en el mundo
8. Cómo México perdió la mitad de su territorio
9. Los países más nuevos del mundo
10. Las fronteras más raras de América

---

## 9. Próximos pasos

1. Elegir voz (tuya o ElevenLabs) y nombre del canal.
2. Implementar: audio por etapa → duraciones automáticas → subtítulos sincronizados → música.
3. Pasar la configuración a JSON y producir los temas 1 a 3.
4. Publicar, medir retención durante 2 semanas y ajustar.
