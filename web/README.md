# English Time: landing en Next.js

Es la misma landing de `../landing/index.html` pasada a Next.js 16. El diseño, los textos, las animaciones y los enlaces de WhatsApp son idénticos: se comparó elemento por elemento y píxel a píxel.

## Comandos

```bash
npm run dev      # desarrollo en http://localhost:3000
npm run build    # compilación de producción (la página sale estática)
npm start        # sirve la compilación
npm run piezas   # regenera las publicidades: 5 de adultos y 10 de Juniors (5 con precios y 5 de marca) (PNG en ../publicidades) y la imagen para compartir /juniors
```

## Dónde se edita cada cosa

| Qué | Archivo |
|---|---|
| Textos, precios, promociones, planes, modalidades (particulares y grupales), preguntas y mensajes de WhatsApp | `lib/contenido.tsx` |
| English Time Juniors (niños), en su propia página `/juniors` (`app/juniors/page.tsx`): Club de Adelantados, fechas del reto, misiones, niveles (con sus grados), carpeta de logros, ofertas con precios, tarifa de hermanos y preguntas de los papás | `JUNIORS`, `RETO`, `MISIONES`, `NIVELES`, `CARPETA`, `OFERTAS_JUNIORS`, `HERMANOS` y `PREGUNTAS_JUNIORS` en `lib/contenido.tsx`; logo en `public/assets/juniors-logo*.webp` |
| Aviso de Juniors en el inicio (sello que gira y mensajes que cambian, lleva a `/juniors`) | `AvisoJuniors` en `components/secciones.tsx` |
| Tasa del dólar para los precios en USD (`TRM` y `FECHA_TRM`) | `lib/contenido.tsx` y el script del final de `public/piezas/piezas.html` |
| Países del mapa (lista de texto) | `PAISES` en `lib/contenido.tsx` |
| Rutas y puntos del mapa | `lib/mapa.ts`, `public/assets/mapa-*.svg` (se regeneran con `scripts/generar-mapa.mjs`) |
| Diseño de las 5 publicidades (también son las tarjetas del carrusel) | `public/piezas/piezas.html` |
| Diseño de las publicidades de Juniors (5 de Black Friday y 5 de marca, sin precios) y de la imagen al compartir `/juniors` | `public/piezas/juniors.html` |
| Secciones de la página | `components/secciones.tsx` |
| Animaciones, cuenta regresiva, carrusel, barra fija (con su versión Juniors), sello de Black Friday, puntos del mapa, letras que giran, pregunta de niveles y mazo de ofertas de Juniors en el celular | `components/Interacciones.tsx` |
| Estilos | `app/globals.css` |
| Título, descripción, imagen para compartir y saludo según la hora (script del `<head>`) | `app/layout.tsx` |

Si cambia un precio, cámbialo en `lib/contenido.tsx` y en `public/piezas/piezas.html` (o `juniors.html` si es de niños), y corre `npm run piezas`. Los dólares se calculan solos con la `TRM`. Si cambia la TRM, cámbiala en los dos archivos y corre `npm run piezas`.

Para agregar un país al mapa: súmalo a `DESTINOS` en `scripts/generar-mapa.mjs` y a `PAISES` en `lib/contenido.tsx`, y corre el script (las instrucciones están en su encabezado).

## Publicar

El sitio se publica solo en GitHub Pages con cada cambio que llega a `main` (`../.github/workflows/publicar.yml`). `npm run build` genera la carpeta `out/` con todo estático; al terminar, `postbuild` copia `out/juniors.html` a `out/juniors/index.html` para que `/juniors` abra en GitHub Pages con o sin barra al final.
El dominio `englishtime.com.co` apunta a GitHub Pages desde Namecheap.

## SEO

- Metadatos, Open Graph y Twitter en `app/layout.tsx`. Las palabras clave están en `lib/seo.ts`.
- Datos estructurados (academia, cursos con precios, promociones y preguntas frecuentes) en `lib/seo.ts`. Se insertan en la página como JSON-LD.
- `sitemap.xml`, `robots.txt`, `manifest.webmanifest` y `llms.txt` se generan desde `app/` con el mismo contenido de la página.
- Imagen para compartir: `app/opengraph-image.png` (1200×630).
- Para Google Search Console, define `NEXT_PUBLIC_GOOGLE_VERIFICATION` con el código que te da Google, o verifica el dominio por DNS en Namecheap.
