// Las páginas que tiene que encontrar Google. La 404 no va. Una página nueva en src/pages suma su línea acá.
const pages = ['https://ibtechteam.com/'];

export function GET() {
  const urls = pages.map((loc) => `  <url>\n    <loc>${loc}</loc>\n  </url>`).join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
