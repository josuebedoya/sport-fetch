# SPORTTECH — Tecnología que impulsa el deporte

Revista digital ilustrada sobre tecnología aplicada al deporte: termografía deportiva, estadios inteligentes y nanotecnología.

Página estática en HTML, CSS y JavaScript, sin dependencias.

## Cómo verla

El contenido se carga desde `data/blog.json`, así que la página necesita servirse por HTTP (abrir `index.html` con doble clic no funciona):

```bash
npx serve .
# o
python -m http.server
```

Luego abre `http://localhost:3000` (o el puerto que indique el servidor).

## Estructura

```
index.html       estructura de la página
css/blog.css     estilos
js/blog.js       lógica: render, filtros, búsqueda, lector y reproductor
data/blog.json   contenido: categorías, conceptos, fuentes, artículos, noticias, mitos, videos y recursos
images/          fotos, miniaturas de video e iconos SVG (créditos en images/CREDITS.md)
blog.md          documento base de investigación y contenido
BLOGRULES.MD     lineamientos de diseño
```

Para añadir contenido basta con agregar entradas en `data/blog.json`.

## Créditos

Las imágenes provienen de Openverse y Wikimedia Commons con licencias libres; los iconos son de Lucide (ISC) y Simple Icons (CC0). Ver [images/CREDITS.md](images/CREDITS.md).
