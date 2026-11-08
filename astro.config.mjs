import { defineConfig } from 'astro/config';

// Igual que pgdstudio.co: sitio estático, y la página 404 sale como 404.html, que es lo que busca Cloudflare Pages.
export default defineConfig({
  site: 'https://ibtechteam.com',
  build: {
    format: 'file',
    // Una hoja de estilos con el contenido en el nombre, que se guarda en caché bajo /_astro/ (public/_headers).
    inlineStylesheets: 'never',
  },
});
