# IBtech web

La página de links de IBtech en [ibtechteam.com](https://ibtechteam.com), con los mismos links que tenía [el Linktree](https://linktr.ee/ibtechteam). Está hecha con los estándares de PGD Studio que aplican a una página fuera de Webflow: SEO, accesibilidad, performance y tracking.

La página es `index.html`. Las imágenes y las tipografías están en `assets/`. Se publica en GitHub Pages con cada push a `main`.

## Cambiar un link

Cada link es un `<a>` en `index.html`. Se cambia el `href` (adónde lleva) y el texto. Para el tracking:

- `data-track` es el nombre del evento: `outbound_click`, `cta_click` o `email_click`.
- `data-track-label` es el nombre con el que aparece el link en GA4 y PostHog.

Una imagen nueva va en WebP, del tamaño en que se muestra (480 × 270 las de los videos), con `alt=""` si al lado está el título.

## Analítica

La página carga solo Google Tag Manager, y GA4 y PostHog se configuran adentro de GTM. Los eventos van al `dataLayer`, con el mismo formato que `track.js` de PGD.

- El ID del contenedor va en `window.IBTECH.gtm`, arriba de todo en `index.html`.
- GTM carga solo en ibtechteam.com y en www.ibtechteam.com. En la compu, los eventos se muestran en la consola y no se mandan.
- Consent Mode v2 arranca con la publicidad denegada y la analítica permitida. No hay banner de cookies.

### Qué se configura en GTM

1. Una etiqueta de Google con el ID de medición de GA4, en todas las páginas.
2. Una etiqueta de evento de GA4 con el nombre `{{Event}}`, que se dispara con un evento personalizado que cumple `^(cta_click|outbound_click|email_click|section_view)$`. Lleva como parámetros `label`, `section`, `href` y `page_path`, cada uno como variable de capa de datos.
3. PostHog, con una etiqueta de HTML personalizado con el snippet de PostHog en todas las páginas, y los mismos eventos mandados con `posthog.capture`.
4. En GA4, en la medición mejorada, se apagan los clics salientes, porque ya los cuenta `outbound_click`.

## Eventos

| Evento | Cuándo | Parámetros |
|---|---|---|
| `section_view` | Una sección se ve al 50%, una vez por visita | `section` |
| `cta_click` | Clic en "¡Suscribite en YouTube!" | `label`, `section`, `href` |
| `outbound_click` | Clic en un video o una red | `label`, `section`, `href` |
| `email_click` | Clic en el ícono del mail | `label`, `section`, `href` |

Todos llevan también `page_path`. Las secciones son `perfil`, `cta`, `videos` y `redes`.

## Scripts de terceros

| Script | Qué hace | Quién lo pidió |
|---|---|---|
| Google Tag Manager | Carga GA4 y PostHog | Pablo, 2026-11-05 |

## Decisiones

- Las tipografías, Red Hat Display y Gasoek One, están alojadas en la página y no se cargan desde Google Fonts. Son solo los caracteres latinos y los pesos en uso, y las dos se precargan.
- Los colores son los del Linktree. Los manchones del fondo son un poco más oscuros que el rojo más claro, para que el texto de los botones tenga un contraste de 4,5:1 en toda la página.
- Las flechas del carrusel funcionan solo con el mouse. Con el teclado, Tab recorre los videos, y el carrusel se mueve solo.

## Probarla en la compu

```bash
python3 -m http.server 8765
```

Y se abre http://localhost:8765.
