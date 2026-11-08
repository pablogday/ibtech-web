# IBtech web

La página de links de IBtech en [ibtechteam.com](https://ibtechteam.com), con los mismos links que tenía [el Linktree](https://linktr.ee/ibtechteam). Está hecha con los estándares de PGD Studio que aplican a una página fuera de Webflow: SEO, accesibilidad, performance y tracking.

Es un sitio estático en [Astro](https://astro.build), publicado en Cloudflare Pages, igual que pgdstudio.co. Lo decidió Pablo el 2026-11-06.

## Probarla en la compu

```bash
npm ci
npm run dev
```

Y se abre http://localhost:4321. Para ver lo mismo que se publica:

```bash
npm run build
npm run preview
```

## Cómo está armada

| Archivo | Qué tiene |
|---|---|
| `src/pages/index.astro` | La página. Arriba de todo están los íconos, los videos y las redes, cada uno en una lista |
| `src/pages/404.astro` | La página para una dirección que no existe |
| `src/pages/sitemap.xml.ts` | El sitemap. Una página nueva suma su línea acá |
| `src/layouts/Layout.astro` | El `<head>`, el link para saltar al contenido y el footer, que comparten las dos páginas |
| `src/components/HeadScripts.astro` | La configuración (`window.IBTECH`) y Google Tag Manager |
| `src/components/Tracking.astro` | Los eventos al `dataLayer` |
| `src/components/Icon.astro` | Los íconos de Instagram, TikTok, YouTube y el mail |
| `src/styles/site.css` | Los estilos |
| `public/` | Lo que se publica tal cual: imágenes y tipografías en `assets/`, `robots.txt` y `_headers` |

## Cambiar un link

Los links están en las listas de arriba de todo en `src/pages/index.astro`: `iconos`, `videos` y `redes`. Se cambia el `href` (adónde lleva) y el texto. `trackLabel` es el nombre con el que aparece el link en GA4 y PostHog.

Un video nuevo lleva su imagen en WebP de 480 × 270, en `public/assets/`. Las dos primeras imágenes del carrusel cargan enseguida, y el resto cuando se acerca.

Fuera de las listas, cada link lleva `data-track`, que es el nombre del evento: `outbound_click`, `cta_click` o `email_click`.

## Analítica

El estándar de Pablo es que todo el tracking entre por Google Tag Manager, en todos sus proyectos. Por ahora PostHog va directo en la página, porque todavía no está el contenedor de GTM, y pasa adentro cuando esté. Los eventos van al `dataLayer` y a PostHog, con el mismo formato que `track.js` de PGD.

- El ID del contenedor va en `window.IBTECH.gtm`, y la clave pública de PostHog en `window.IBTECH.posthog`, los dos en `src/components/HeadScripts.astro`.
- GTM y PostHog cargan solo en ibtechteam.com y en www.ibtechteam.com. En la compu y en las previews, los eventos se muestran en la consola y no se mandan.
- No hay banner de cookies ni Consent Mode. Todo se dispara al cargar la página. Lo decidió Pablo el 2026-11-05.

### Qué se configura en GTM

1. Una etiqueta de Google con el ID de medición de GA4, en todas las páginas.
2. Una etiqueta de evento de GA4 con el nombre `{{Event}}`, que se dispara con un evento personalizado que cumple `^(cta_click|outbound_click|email_click|section_view)$`. Lleva como parámetros `label`, `section`, `href` y `page_path`, cada uno como variable de capa de datos.
3. PostHog, con una etiqueta de HTML personalizado con el snippet de PostHog en todas las páginas, y los mismos eventos mandados con `posthog.capture`. Cuando ande, se saca el snippet de `HeadScripts.astro` y el `posthog.capture` de `Tracking.astro`.
4. En GA4, en la medición mejorada, se apagan los clics salientes, porque ya los cuenta `outbound_click`.

## Eventos

| Evento | Cuándo | Parámetros |
|---|---|---|
| `section_view` | Una sección se ve al 50%, una vez por visita | `section` |
| `cta_click` | Clic en "¡Suscribite en YouTube!" o en "Volver al inicio" de la 404 | `label`, `section`, `href` |
| `outbound_click` | Clic en un video o una red | `label`, `section`, `href` |
| `email_click` | Clic en el ícono del mail | `label`, `section`, `href` |

Todos llevan también `page_path`. Las secciones son `perfil`, `cta`, `videos` y `redes`, y en la 404, `no-encontrada`.

## Scripts de terceros

| Script | Qué hace | Quién lo pidió |
|---|---|---|
| Google Tag Manager | Carga GA4 | Pablo, 2026-11-05 |
| PostHog | Páginas vistas, clics y los eventos de arriba. Va directo hasta que esté el contenedor de GTM | Pablo, 2026-11-08 |

## Publicación

Cloudflare Pages, conectado a este repo de GitHub (un proyecto de Pages, no de Workers). La configuración es la misma que la de pgdstudio.co:

| Opción | Valor |
|---|---|
| Proyecto | `ibtechteam-com`, en la cuenta de Cloudflare de PGD |
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Production branch | `main` |
| Node | 22, que sale de `.node-version` (o `NODE_VERSION=22` en las variables de entorno del proyecto) |

**Cada rama tiene su URL de preview, y esa es la de prueba.** Se sube una rama, se abre un pull request y se revisa la preview que deja Cloudflare.

**Mergear a `main` es publicar. Lo hace Pablo, y Claude nunca.**

## Pasar el dominio a Cloudflare

Son pasos de Pablo en Cloudflare, Hover y GitHub. Nada de este repo los hace. Van en este orden, porque Cloudflare publica `main` y hasta el merge `main` no tiene Astro.

1. **Proyecto de Pages.** En la misma cuenta de Cloudflare que pgdstudio.co, se crea el proyecto conectado a `pablogday/ibtech-web`, con la configuración de arriba. El repo es de la cuenta personal de Pablo, y la app de Cloudflare está instalada en la org `pgdstudio`, donde este repo no aparece. Hay que instalarla también en la cuenta `pablogday`, con acceso solo a este repo, desde [la página de la app](https://github.com/apps/cloudflare-workers-and-pages/installations/new).
2. **Preview.** Se revisa la preview de la rama `site-build` con la lista de abajo.
3. **GitHub Pages.** Se apaga en Settings → Pages de este repo, y se saca de la rama el archivo `CNAME`, que solo usa GitHub Pages.
4. **Merge.** Pablo mergea el pull request. Cloudflare publica `main` en su dirección `.pages.dev`.
5. **Zona.** Se agrega ibtechteam.com en Cloudflare, con el plan Free. Cloudflare importa los registros que encuentra en Hover. Se comparan con el panel de Hover:
   - Se dejan el MX (`mx.hover.com.cust.hostedemail.com`, prioridad 10) y el CNAME `mail` (`mail.hover.com.cust.hostedemail.com`), que van al mail de Hover.
   - Los A de `ibtechteam.com` y `www` que apuntan a `216.40.34.41`, que es la redirección de Hover a Linktree, se dejan por ahora, sin proxy. Se borran en el paso 7.
6. **Nameservers.** En Hover se cambian los de ibtechteam.com por los dos que da Cloudflare. El dominio sigue registrado en Hover.
7. **Dominio en Pages.** Cuando la zona figura como activa, se borran los dos A y enseguida se agrega `ibtechteam.com` como dominio del proyecto de Pages. Cloudflare crea solo el CNAME. Los A se dejan hasta acá para que el dominio no quede sin responder en el medio.
8. **www.** Igual que pgdstudio.co: un registro DNS proxied para `www` (por ejemplo, un CNAME a `ibtechteam.com`) y una Redirect Rule de `www.ibtechteam.com/*` a `https://ibtechteam.com/${1}`, con estado 301 y conservando la query. Y "Always Use HTTPS" prendido, para que `http://` pase a `https://`.
9. **Headers.** `public/_headers` manda HSTS, `frame-ancestors 'self'` y `X-Frame-Options: SAMEORIGIN`, igual que pgdstudio.co. Si la zona también agrega HSTS desde SSL/TLS, queda uno de los dos.

### Qué se revisa, en la preview y en ibtechteam.com después del cambio

- `/` responde 200, sin redirección, y con candado.
- `http://ibtechteam.com/` y `https://www.ibtechteam.com/` redirigen con 301 a `https://ibtechteam.com/`.
- Una dirección que no existe responde 404 con la página 404.
- `/robots.txt` y `/sitemap.xml` son los de `public/` y `src/pages/`.
- Están los headers de `public/_headers`.
- En la consola de la preview aparecen los eventos como "no enviado". En ibtechteam.com se ven en PostHog, en Activity, y, cuando haya ID de GTM, en GTM Preview.
- El MX de ibtechteam.com sigue apuntando al mail de Hover.

## Decisiones

- Las tipografías, Red Hat Display y Gasoek One, están alojadas en la página y no se cargan desde Google Fonts. Son solo los caracteres latinos y los pesos en uso, y las dos se precargan.
- Los colores son los del Linktree. Los manchones del fondo son un poco más oscuros que el rojo más claro, para que el texto de los botones tenga un contraste de 4,5:1 en toda la página.
- El borde de los botones, del recuadro de los videos y de las flechas es blanco al 65%, con un contraste de al menos 3:1 contra el fondo en toda la página. En el Linktree era blanco al 20%, con 1,5:1. WCAG no le exige borde a un botón con texto visible, y el cambio lo decidió Pablo el 2026-11-08.
- Las flechas del carrusel funcionan solo con el mouse. Con el teclado, Tab recorre los videos, y el carrusel se mueve solo.
- La página 404 es nueva, porque sin `404.html` Cloudflare Pages responde con la home a cualquier dirección. Sus textos ("Esta página no existe." y "Volver al inicio") los aprobó Pablo el 2026-11-08.
- Los estilos van en un archivo aparte bajo `/_astro/`, que el navegador guarda en caché, como en pgdstudio.co.
