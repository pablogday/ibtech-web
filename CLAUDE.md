# ibtech-web

La página de links de IBtech en ibtechteam.com: Astro estático, publicado por Cloudflare Pages. Leer `README.md` primero. Lo que pasa con la página se anota en la bitácora de `ibtech-core`.

## Reglas

- Todo se escribe en español de Argentina, con voseo: textos, comentarios, commits y documentación.
- Nunca se pushea a `main`. Mergear a `main` es publicar, y Claude mergea solo si Pablo o Chapa se lo piden en el chat.
- Se trabaja en una rama, en su propio worktree. Cada commit se sube apenas está, y con el primero se abre un pull request en borrador. La URL de preview de Cloudflare de la rama es la de prueba.
- Mensajes de commit cortos, de una línea, diciendo qué cambió.
- Sin dependencias nuevas sin el ok de Pablo o Chapa. Una de desarrollo necesita un motivo, y por defecto no va ninguna.
- El tracking lee el HTML, así que `data-section`, `data-track`, `data-track-label` e `id="main"` quedan como están.
- No se escriben textos visibles nuevos sin preguntarle a Pablo o a Chapa.
- `npm run build` antes de cada push. El build tiene que pasar desde un `npm ci` limpio.
