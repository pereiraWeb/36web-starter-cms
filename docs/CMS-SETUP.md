# Alta del CMS (piloto)

Este starter edita contenido con TinaCMS. La web pública sigue siendo Astro estático. El editor vive en `/admin` y no convierte las páginas en React.

Hoy el piloto cubre:

- Título, descripción y fotografía de la portada (`content/pages/home.json`).
- Un servicio y su página (`content/services/service-one.json` → `/services/service-one`).

El resto de textos sigue en `src/config/`. Dominio, analítica, destinatario del formulario y diseño no están en el editor.

Versiones comprobadas al instalar: Astro 7.1.3, `@tinacms/astro` 0.7.1 (compatible con Astro 5, 6 y 7), `tinacms` 3.14.1, `@tinacms/cli` 3.1.0. La guía oficial es [Astro + TinaCMS](https://tina.io/docs/frameworks/astro) y [edición visual en Astro](https://tina.io/docs/contextual-editing/astro).

## Local, sin cuenta

```bash
npm install
npm run dev
```

- Web: http://localhost:4321/
- Editor: http://localhost:4321/admin/index.html

`npm run dev` ejecuta `tinacms dev` y Astro juntos. En local no hace falta TinaCloud: el editor escribe en los JSON del repositorio. No inicies sesión en ningún servicio.

`npm run build` sin variables de Tina indexa `content/` y genera el sitio. El aviso de datos de ejemplo de `src/config/business.ts` sigue bloqueando ese build hasta cambiarlos, o hasta `SKIP_CONFIG_GUARD=true` en un ensayo.

`npm run check` revisa los tipos. `tina/config.ts` queda fuera de esa revisión porque los tipos del esquema no encajan con el comprobador de Astro; `tinacms build` valida el esquema.

## Un proyecto y un repositorio por cliente

No hay una plataforma con varios clientes dentro. Cada web tiene:

- su repositorio de Git;
- su proyecto en [TinaCloud](https://app.tina.io);
- su proyecto de hosting.

36WEB entra como administrador del proyecto TinaCloud. El cliente entra como editor. Los pasos de invitación y de baja están en [CMS-OPERACION.md](CMS-OPERACION.md).

## Conectar TinaCloud

Estos pasos no están hechos en este repositorio. No hay identificadores ni tokens de ejemplo reales.

1. Sube el repositorio del cliente a GitHub. Incluye `content/` y `tina/config.ts`. No subas `.env`.
2. Entra en [app.tina.io](https://app.tina.io) y crea un proyecto nuevo apuntando a ese repositorio y a la rama `main`.
3. En el proyecto, copia el Client ID (Overview) y crea un token de **solo lectura** (Tokens).
4. Pon los dos valores en `.env` en la raíz (Tina no lee `.env.local`):

   ```bash
   NEXT_PUBLIC_TINA_CLIENT_ID=
   TINA_TOKEN=
   ```

5. Copia las mismas variables al hosting, disponibles en el momento del build.
6. El comando de build del hosting es `npm run build`. Si las dos variables existen, construye el editor contra TinaCloud. `npm run build:cloud` hace lo mismo y falla si falta alguna.
7. Abre `https://el-dominio/admin/index.html` e inicia sesión con TinaCloud.

El Client ID es público y queda dentro del JavaScript de `/admin`. El token es de solo lectura y no debe llevar prefijo `PUBLIC_`, `NEXT_PUBLIC_` ni `TINA_PUBLIC_`. No uses un token de escritura.

## Qué ve el cliente

| Apartado del editor | Dónde sale en la web | Archivo |
|---|---|---|
| Inicio | Título, párrafo y foto de la portada | `content/pages/home.json` |
| Servicios → Service One | Página `/services/service-one` y ficha de ese servicio en la portada | `content/services/service-one.json` |

La foto nueva se sube desde el campo de imagen y se guarda en `public/uploads/`. En local, el archivo aparece en el disco. Con TinaCloud, el cambio entra en Git junto con el contenido. No se escribe en el disco efímero del hosting.

El nombre del archivo del servicio es la URL: `service-one.json` es `/services/service-one`. Si se renombra, la URL antigua deja de existir. Para conservarla, añade una redirección en `redirects` de `astro.config.mjs` antes de publicar.

Borrar el documento del servicio borra el JSON. En el siguiente despliegue, esa URL desaparece. Los otros servicios de ejemplo siguen saliendo de `src/config/servicesContent.ts` y no se editan aquí.

## Publicar

Guardar en el editor y ver la web pública son momentos distintos.

1. En local, Guardar escribe el JSON en el repositorio. La previsualización del editor cambia antes de guardar; eso no es la web pública.
2. Con TinaCloud, Guardar crea un commit en la rama conectada (en el plan sin flujo editorial, el commit va directo a esa rama).
3. El hosting construye ese commit.
4. La web pública cambia cuando ese despliegue ha terminado. Comprueba la URL pública. El editor no puede afirmar que ya está actualizada.

En el plan gratuito y en el plan Team no hay borradores, aprobación ni ramas de revisión. Eso aparece en Team Plus o superior. Ver [CMS-OPERACION.md](CMS-OPERACION.md).

## Fuera de este piloto

Todavía no están en el editor: negocio (teléfono, horarios, logo), nosotros, contacto, el resto de servicios, equipo, preguntas, opiniones, SEO por página y textos legales. El formulario sigue en `/api/contact` con Resend y no guarda mensajes en Tina.
