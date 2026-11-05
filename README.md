# IBtech web

La página de links de IBtech en [ibtechteam.com](https://ibtechteam.com), con los mismos links que tenía el Linktree. Reemplaza a [linktr.ee/ibtechteam](https://linktr.ee/ibtechteam).

Es un solo archivo, `index.html`, y las imágenes están en `assets/`.

## Cambiar un link

Cada link es un `<a>` en `index.html`. Se cambia el `href` (adónde lleva) y el texto. El atributo `data-track` es el nombre con el que aparece el clic en GA4 y PostHog.

## Analítica

Los IDs van en `CONFIG`, al final de `index.html`:

- `ga4`: el ID de medición de GA4, que empieza con `G-`.
- `posthogKey`: el Project API key de PostHog, que empieza con `phc_`. Es una clave pública, pensada para ir en la página.
- `posthogHost`: `https://us.i.posthog.com`, o `https://eu.i.posthog.com` si el proyecto de PostHog está en Europa.

Si un ID está vacío, ese servicio no se carga. Cada clic en un link se registra como el evento `click_link`, con `link_name` y `link_url`.

## Probarla en la compu

```bash
python3 -m http.server 8765
```

Y se abre http://localhost:8765.
