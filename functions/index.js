// Cambia los videos del carrusel de la home por los últimos del canal, cada vez que alguien pide la página.
// Si falta la clave o YouTube no responde, la página sale con la lista de src/pages/index.astro.

const CANAL = 'UCf3vUxDeJmSUJyte9M_EpAQ';
// UULF es la lista que YouTube arma sola con los videos largos del canal, sin Shorts ni vivos.
const LISTA = `UULF${CANAL.slice(2)}`;
const CANTIDAD = 5;
// Cuántos segundos se guarda la respuesta de YouTube. Un video nuevo aparece en una hora como mucho.
const GUARDAR = 3600;
// Cuántos milisegundos se espera a YouTube antes de seguir con la lista de respaldo.
const ESPERA_MAXIMA = 2000;

async function pedirVideos(clave) {
  const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
  url.search = new URLSearchParams({ part: 'snippet,status', playlistId: LISTA, maxResults: '15', key: clave });
  const respuesta = await fetch(url, { signal: AbortSignal.timeout(ESPERA_MAXIMA) });
  if (!respuesta.ok) throw new Error(`YouTube respondió ${respuesta.status}`);
  const { items = [] } = await respuesta.json();
  return items
    .filter((item) => item.status?.privacyStatus === 'public')
    .slice(0, CANTIDAD)
    .map((item) => ({ id: item.snippet.resourceId.videoId, titulo: item.snippet.title }));
}

async function ultimosVideos(contexto) {
  const guardado = new Request('https://ibtechteam.com/ultimos-videos');
  const encontrado = await caches.default.match(guardado);
  if (encontrado) return encontrado.json();

  const videos = await pedirVideos(contexto.env.YOUTUBE_API_KEY);
  if (videos.length === CANTIDAD) {
    const copia = new Response(JSON.stringify(videos), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': `max-age=${GUARDAR}` },
    });
    contexto.waitUntil(caches.default.put(guardado, copia));
  }
  return videos;
}

export async function onRequestGet(contexto) {
  if (!contexto.env.YOUTUBE_API_KEY) return contexto.next();

  let videos;
  try {
    videos = await ultimosVideos(contexto);
  } catch (error) {
    console.error(`No se pudieron traer los videos: ${error.message}`);
    return contexto.next();
  }
  if (videos.length < CANTIDAD) return contexto.next();

  // Se pide la página sin los encabezados del navegador, porque si contestara "no cambió" vendría vacía.
  const pagina = await contexto.next(contexto.request.url);

  let n = -1;
  const reescrita = new HTMLRewriter()
    .on('a.video', {
      element(link) {
        n += 1;
        if (!videos[n]) return;
        link.setAttribute('href', `https://youtu.be/${videos[n].id}`);
        link.setAttribute('data-track-label', `Video ${videos[n].titulo}`.slice(0, 80));
      },
    })
    .on('a.video img', {
      element(imagen) {
        if (videos[n]) imagen.setAttribute('src', `https://i.ytimg.com/vi/${videos[n].id}/hqdefault.jpg`);
      },
    })
    .on('a.video span', {
      element(titulo) {
        if (videos[n]) titulo.setInnerContent(videos[n].titulo);
      },
    })
    .transform(pagina);

  // El ETag es el de la página sin reemplazar. Si quedara, el navegador podría seguir mostrando videos viejos.
  const salida = new Response(reescrita.body, reescrita);
  salida.headers.delete('ETag');
  return salida;
}
