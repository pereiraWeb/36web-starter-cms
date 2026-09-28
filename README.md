# 360 Presencia Starter

Plantilla de web corporativa hecha con [Astro](https://astro.build). Incluye todas las secciones típicas de una web de empresa (portada, servicios, equipo, testimonios, preguntas frecuentes, contacto...), cada una con **varias variantes visuales** para elegir, y un **formulario de contacto funcional** que envía emails de verdad mediante [Resend](https://resend.com).

Todo el contenido (textos, colores, datos de la empresa, menú...) está centralizado en archivos de configuración fáciles de editar, en `src/config/`. **No hace falta tocar el diseño ni el código de los componentes para lanzar tu web** — solo rellenar esos archivos con tus datos reales.

Esta guía explica, paso a paso y sin tecnicismos, cómo convertir este starter en la web real de una empresa.

---

## Índice

1. [Requisitos previos](#1-requisitos-previos)
2. [Puesta en marcha en local](#2-puesta-en-marcha-en-local)
3. [Estructura del proyecto](#3-estructura-del-proyecto)
4. [Cómo personalizar la web paso a paso](#4-cómo-personalizar-la-web-paso-a-paso)
5. [El formulario de contacto (envío de emails reales)](#5-el-formulario-de-contacto-envío-de-emails-reales)
6. [Cookies, consentimiento y analítica (GA4, Google Ads, Meta Pixel)](#6-cookies-consentimiento-y-analítica-ga4-google-ads-meta-pixel)
7. [SEO técnico: idioma, sitemap, robots.txt y datos estructurados](#7-seo-técnico-idioma-sitemap-robotstxt-y-datos-estructurados)
8. [Variables de entorno](#8-variables-de-entorno)
9. [Qué necesitas para tener una web 100% real en producción](#9-qué-necesitas-para-tener-una-web-100-real-en-producción)
10. [Cómo publicar la web (Vercel)](#10-cómo-publicar-la-web-vercel)
11. [Comandos disponibles](#11-comandos-disponibles)
12. [Checklist final antes de publicar](#12-checklist-final-antes-de-publicar)
13. [Arquitectura interna: temas, configuración, layouts y componentes compartidos](#13-arquitectura-interna-temas-configuración-layouts-y-componentes-compartidos)
14. [Accesibilidad](#14-accesibilidad)
15. [Imágenes: rendimiento y carga](#15-imágenes-rendimiento-y-carga)
16. [Rendimiento: fuentes, CSS/JS y Core Web Vitals](#16-rendimiento-fuentes-cssjs-y-core-web-vitals)

---

## 1. Requisitos previos

Para trabajar con este proyecto en tu ordenador necesitas:

- **[Node.js](https://nodejs.org/)** versión 22.12 o superior (incluye `npm`).
- Un editor de código (recomendado: [Cursor](https://cursor.com) o [VS Code](https://code.visualstudio.com/)).
- Conocimientos básicos de terminal (copiar y pegar comandos es suficiente).

No hace falta saber programar para editar los textos, colores o datos de la empresa: son archivos de configuración sencillos.

---

## 2. Puesta en marcha en local

```bash
# 1. Instala las dependencias
npm install

# 2. Copia el archivo de variables de entorno de ejemplo
cp .env.example .env

# 3. Arranca el servidor de desarrollo
npm run dev
```

Abre [http://localhost:4321](http://localhost:4321) en el navegador. Cada vez que guardes un cambio en el código, la página se actualiza sola.

> El archivo `.env` es privado (no se sube a git) y es donde van tus claves reales, como la de Resend. Sin él, el formulario de contacto funciona igualmente en local, mostrando el mensaje enviado por consola en vez de mandar un email real (ver [sección 5](#5-el-formulario-de-contacto-envío-de-emails-reales)).

---

## 3. Estructura del proyecto

```
src/
├── config/        ← 🎯 AQUÍ SE EDITA EL CONTENIDO (textos, datos, colores, menú...)
├── components/    ← Piezas visuales reutilizables (hero, servicios, contacto, footer...)
│   ├── hero/          → 5 estilos de cabecera/portada distintos
│   ├── services/      → 5 estilos para mostrar servicios
│   ├── contact/       → 5 estilos de sección de contacto
│   ├── team/          → variantes para el equipo
│   ├── testimonials/  → variantes para testimonios
│   ├── faq/           → variantes para preguntas frecuentes
│   ├── footer/        → variantes de pie de página
│   ├── header/        → variantes de cabecera de navegación
│   ├── cta/           → llamadas a la acción
│   ├── cards/         → tarjetas reutilizables
│   ├── media/         → sección texto + imagen, mapa y vídeo de YouTube (con gestor de cookies)
│   ├── forms/         → el formulario de contacto y sus piezas
│   ├── seo/           → datos estructurados JSON-LD (Organization, LocalBusiness, Service, FAQ)
│   └── ui/            → botones, iconos, menú, cookies, WhatsApp, SEO del `<head>`, componentes
│                         compartidos como `SectionHeading`/`BrandMark`, etc.
├── pages/         ← Cada archivo es una página real de la web (/, /contact, /about...)
│   ├── demos/         → galería de variantes (disponible en `astro dev`; excluida del build de producción por defecto — ver sección 16)
│   ├── legal/         → aviso legal, política de privacidad y cookies
│   ├── api/contact.ts → el "cerebro" del formulario de contacto (servidor)
│   ├── 404.astro      → página mostrada cuando una URL no existe
│   ├── robots.txt.ts  → genera `/robots.txt` a partir de `business.siteUrl`
│   └── site.webmanifest.ts → genera el manifest de la web a partir de `business.ts`
├── layouts/       → estructura común de las páginas: `BusinessLayout` (base), y `PageLayout`,
│                     `LegalLayout`, `ServiceLayout` construidos sobre ella (ver sección 13.5)
└── lib/           → funciones internas de apoyo (validaciones, envío de email, SEO, consentimiento, analítica...)

public/            ← Imágenes, logo y favicon reales de la web
```

**Idea clave:** cada página en `src/pages/` (por ejemplo `index.astro`) simplemente **combina componentes**, como piezas de Lego. Para cambiar el estilo de una sección, se cambia qué componente se usa en esa página (por ejemplo, pasar de `HeroBackground` a `HeroSplit`). Puedes ver todas las variantes disponibles navegando a `/demos` con el proyecto en marcha.

---

## 4. Cómo personalizar la web paso a paso

Toda la personalización de contenido se hace en la carpeta **`src/config/`**. Cada archivo es una lista de textos/datos con comentarios explicando para qué sirve cada campo.

### 4.1 Datos de la empresa — `src/config/business.ts`

Es el archivo más importante. Rellena aquí los datos reales:

| Campo | Qué es |
|---|---|
| `name` | Nombre comercial (aparece en el header, footer, títulos de página...) |
| `legalName` | Razón social completa (aparece en el copyright del footer) |
| `tagline` | Frase corta debajo del nombre |
| `description` | Descripción usada por defecto para SEO (buscadores, WhatsApp, redes sociales) |
| `email` | Email de contacto público |
| `phone` | Teléfono (también se usa para el botón flotante de WhatsApp) |
| `logo` | Ruta al logo, por defecto `/logos/logo.png` |
| `address` | Dirección física (calle, ciudad, región, código postal, país) |
| `hours` | Horario de atención |
| `social` | Enlaces a Facebook, Instagram, LinkedIn, Twitter/X (deja vacío `''` el que no uses) |
| `siteUrl` | **Dominio final real** de la web (ej. `https://miempresa.es`) — fuente única de verdad del dominio: se usa en el SEO, el `sitemap.xml`, el `robots.txt` y todos los datos estructurados |
| `language` | Idioma de la web en formato [BCP 47](https://es.wikipedia.org/wiki/IETF_language_tag) (ej. `es-ES`, `es`, `en-US`). Controla el `<html lang="...">` y el `og:locale` (`es_ES`) — ver [sección 7](#7-seo-técnico-idioma-sitemap-robotstxt-y-datos-estructurados) |

### 4.2 Colores y estilo — `src/styles/tokens.css`

Cambia aquí el color principal (`--color-primary`), el secundario, el fondo, los textos, el radio de bordes y el ancho máximo del contenido. Son variables CSS estándar, aplicadas automáticamente en toda la web (botones, enlaces, iconos...) — es la **única** fuente de verdad para el diseño del sitio (ver [sección 13.1](#13-arquitectura-interna-temas-configuración-layouts-y-componentes-compartidos)).

### 4.3 Menú de navegación — `src/config/navigation.ts`

- `mainNavigation`: enlaces del menú principal del header.
- `legalNavigation`: enlaces a las páginas legales, mostrados en el footer.
- `demoNavigation`: enlaces a las páginas de `/demos`. Solo se añaden al menú en desarrollo (o si compilas con `INCLUDE_DEMOS=true`); en producción no aparecen ni se generan esas rutas (ver [sección 16](#16-rendimiento-fuentes-cssjs-y-core-web-vitals)).

### 4.4 Logo e imágenes — carpeta `public/`

| Carpeta | Qué poner |
|---|---|
| `public/logos/` | Tu logo real. Por defecto se usa un placeholder en SVG (`logo-fallback.svg`, un icono + el texto "TU LOGO") — sustitúyelo por tu propio archivo y actualiza `business.logo` en `src/config/business.ts` (ver [sección 4.4.1](#441-el-logo-y-sus-variantes)) |
| `public/img/` | Fotos que uses en el contenido. `fallback.webp` es la imagen que se muestra automáticamente si falta alguna imagen — puedes sustituirla por una genérica de tu marca |
| `public/favicon.ico` / `favicon.svg` | El icono que aparece en la pestaña del navegador. Para más que un favicon básico (icono de pantalla de inicio en móvil, PWA...), genera también `apple-touch-icon.png` (180×180) y unos PNG de 192×192/512×512 a partir de tu logo, y añádelos en `src/pages/site.webmanifest.ts` y en el `<head>` de `BusinessLayout.astro` |
| `public/social-images/social-default.webp` | Imagen que se muestra al compartir la web en WhatsApp, Facebook, Twitter/X, etc. (`og:image`), cuando una página no define la suya propia. Viene con una imagen abstracta genérica de ejemplo — sustitúyela por una imagen real de tu marca de **1200×630px** (ver [sección 7](#7-seo-técnico-idioma-sitemap-robotstxt-y-datos-estructurados)). Es un archivo **distinto** del logo a propósito: el logo es pequeño y va en la cabecera, esta imagen es grande y solo se usa en las vistas previas al compartir un enlace |

#### 4.4.1 El logo y sus variantes

El logo se configura en `src/config/business.ts`, no hace falta tocar ningún componente:

```ts
logo: '/logos/mi-logo.svg',       // Logo para fondos claros (por defecto: placeholder)
logoDark: '/logos/mi-logo-blanco.svg', // Opcional: variante para fondos oscuros
logoWidth: 160,                   // Ancho real del archivo, en píxeles
logoHeight: 40,                   // Alto real del archivo, en píxeles
```

- **`logo`** es el que se usa en cabeceras/pies de página normales. Si lo dejas vacío (`''`), se muestra el nombre del negocio como texto en su lugar.
- **`logoDark`** es opcional: solo lo necesitas si usas alguna variante de cabecera/pie con fondo oscuro (`backgroundColor` oscuro, o `HeaderCta`/`FooterCta` con su fondo por defecto) y quieres una versión clara del logo ahí. Pásalo explícitamente con la prop `logo`, por ejemplo `<HeaderCta logo={business.logoDark} backgroundColor="#0f172a" />`.
- **`logoWidth`/`logoHeight`** deben coincidir con las proporciones reales de tu archivo (no con el tamaño en que se muestra — eso lo controla el CSS de cada cabecera/pie). Sirven para que el navegador reserve el espacio correcto antes de que la imagen cargue, evitando que el resto de la página "salte" (esto es el CLS, ver [sección 15](#15-imágenes-rendimiento-y-carga)).
- Formatos recomendados: **SVG** (ideal, escala perfectamente y pesa poco) o **WebP/PNG optimizado** de pocos KB — nunca subas el archivo tal cual sale de un diseño en alta resolución (puede pesar varios MB); pásalo antes por un optimizador como [squoosh.app](https://squoosh.app).
- Si el archivo del logo falla al cargar (ruta mal escrita, archivo borrado...), la web muestra automáticamente el placeholder SVG en su lugar en vez del icono de "imagen rota" del navegador — no requiere ninguna configuración adicional.

### 4.5 Textos de cada sección

Cada sección de la web tiene su propio archivo de configuración en `src/config/`, con el mismo patrón: nombres claros y comentarios en cada campo.

| Sección | Archivo |
|---|---|
| Portada / hero | `heroContent.ts` |
| Servicios | `servicesContent.ts` (incluye título, descripción, imagen y texto largo de cada servicio) |
| Equipo | `teamContent.ts` |
| Testimonios | `testimonialsContent.ts` |
| Preguntas frecuentes | `faqContent.ts` |
| Contacto | `contactContent.ts` |
| Llamadas a la acción | `ctaContent.ts` |
| Cabecera (header) | `headerContent.ts` |
| Pie de página (footer) | `footerContent.ts` |
| Cookies y consentimiento | `cookieConsentContent.ts` (ver [sección 6](#6-cookies-consentimiento-y-analítica-ga4-google-ads-meta-pixel)) |
| Aviso "plantilla incompleta" y fecha de páginas legales | `legalContent.ts` |
| Sección texto + imagen | `textImageContent.ts` |
| Formulario de contacto | `formContent.ts` (ver [sección 5](#5-el-formulario-de-contacto-envío-de-emails-reales)) |

Edita el texto en español (o el idioma que quieras) directamente en estos archivos; los cambios se ven al momento con `npm run dev`.

### 4.6 Elegir qué variante usar en cada página

Abre la página que quieras cambiar (por ejemplo `src/pages/index.astro`) y verás algo así:

```astro
import HeroBackground from '../components/hero/HeroBackground.astro';
...
<HeroBackground align="center" height="550px" />
```

Para usar otro estilo de portada, solo hay que importar otro componente de la misma carpeta (por ejemplo `HeroSplit` en vez de `HeroBackground`) y usarlo en su lugar. Puedes ver todas las opciones disponibles visitando `/demos` mientras trabajas en local.

### 4.7 Redes sociales, WhatsApp y botón "volver arriba"

- Los iconos de redes sociales/contacto del header y del footer se generan automáticamente a partir de `business.social`, `business.email` y `business.phone` (ver `src/lib/iconLinks.ts`). Si dejas un campo vacío, ese icono no se muestra.
- El botón flotante de WhatsApp (`src/components/ui/WhatsappButton.astro`) usa `business.phone` para abrir un chat directo. Verifica que el número esté en formato internacional (ej. `+34 600 000 000`).
- El botón "volver arriba" aparece solo, no requiere configuración.

### 4.8 Páginas legales — `src/pages/legal/`

Contiene `legal-notice.astro` (aviso legal), `privacy.astro` (política de privacidad) y `cookies.astro` (política de cookies). **Son plantillas incompletas a propósito**: cada una muestra un aviso visible en rojo/naranja arriba del todo y tiene campos entre corchetes (ej. `[NIF/CIF DE LA EMPRESA]`) que hay que sustituir por los datos reales antes de publicar — nunca deben quedar así en producción. Ver [sección 8](#8-qué-necesitas-para-tener-una-web-100-real-en-producción).

Cada página muestra también una fecha "Última actualización", controlada desde `src/config/legalContent.ts` (`legalPagesContent.lastUpdated`) — actualízala cada vez que cambies el contenido legal de forma relevante.

---

## 5. El formulario de contacto (envío de emails reales)

Este starter incluye un formulario de contacto completo y ya funcional, no una simple maqueta. El recorrido es:

```
Visitante rellena el formulario (ContactForm)
        ↓
   /api/contact  (validación y seguridad en el servidor)
        ↓
   sendContactEmail()
        ↓
      Resend  →  email real a tu bandeja de entrada
```

Incluye de serie: validación de todos los campos (nombre, email, teléfono, mensaje), casilla de consentimiento RGPD obligatoria, protección anti-spam (honeypot invisible + límite de envíos por IP), mensajes de error accesibles y página de "gracias" tras el envío (`/thank-you`).

**Para que envíe emails de verdad necesitas una cuenta gratuita en [Resend](https://resend.com)** — es el único servicio externo obligatorio de todo el starter. Sin configurarlo, en tu ordenador (`npm run dev`) el formulario sigue funcionando pero solo simula el envío (lo verás en la consola del terminal); en producción, si falta la clave, el formulario avisará de un error en vez de fingir que se envió.

### Cómo configurar Resend (5 minutos)

1. Crea una cuenta gratuita en [resend.com](https://resend.com).
2. Ve a **API Keys** y crea una nueva clave → esa es tu `RESEND_API_KEY`.
3. Ve a **Domains** y añade tu dominio (ej. `miempresa.es`). Resend te dará unos registros DNS (TXT/MX) que debes añadir en el panel de tu proveedor de dominio. Esto puede tardar hasta 24-48h en verificarse, aunque normalmente son minutos.
4. Una vez verificado el dominio, define una dirección de envío de ese dominio, por ejemplo `formularios@miempresa.es` → esa es tu `CONTACT_FROM_EMAIL`.
5. Decide a qué bandeja de entrada quieres que lleguen los mensajes → esa es tu `CONTACT_TO_EMAIL` (puede ser un Gmail, Outlook, etc., no hace falta que sea del dominio verificado).
6. Copia esos tres valores a tu `.env` en local, y a las **Environment Variables** de tu proyecto en Vercel para producción (ver [sección 10](#10-cómo-publicar-la-web-vercel)).

> Mientras el dominio no esté verificado en Resend, puedes seguir probando el formulario en local sin límite (modo simulado, sin `RESEND_API_KEY`) y solo tendrás que añadir las claves reales cuando quieras lanzar la web a producción.

---

## 6. Cookies, consentimiento y analítica (GA4, Google Ads, Meta Pixel)

Este starter incluye un **gestor de consentimiento de cookies real** (no un simple aviso decorativo): nada de analítica o marketing se carga hasta que el visitante lo permite explícitamente, categoría por categoría.

### 6.1 Cómo funciona el gestor de consentimiento

- **`src/lib/consent.ts`** es el "cerebro": guarda en `localStorage` la elección del visitante junto con la **versión** de la política y la **fecha** en que se guardó, y avisa (mediante un evento) a todo lo demás cuando cambia.
- **`src/components/ui/CookieConsent.astro`** es el aviso visible: un primer aviso con "Aceptar todo" / "Rechazar todo" / "Configurar", y un panel de preferencias donde se puede activar o desactivar cada categoría por separado.
- Hay **tres categorías**, definidas y editables en `src/config/cookieConsentContent.ts`:
  1. **Necesarias**: siempre activas, no se pueden desactivar (funcionamiento básico de la web).
  2. **Analíticas**: activa Google Analytics 4 si está configurado.
  3. **Marketing**: activa Google Ads, Meta Pixel, y contenido de terceros como mapas o vídeos incrustados.
- **Enlace permanente**: cada uno de los 5 estilos de footer incluye un enlace "Gestionar cookies" (junto al aviso legal y la política de privacidad) que reabre el panel de preferencias en cualquier momento, para que el visitante pueda cambiar o retirar su consentimiento cuando quiera. Está definido en `cookiePreferencesHref` dentro de `src/config/navigation.ts`.
- **Cambiar de política**: si en el futuro cambias las cookies que usas o su finalidad, sube el número de `version` en `cookieConsentContent.ts` (por ejemplo, de `'1.0'` a `'1.1'`) — esto hace que a todos los visitantes, aunque ya hubieran decidido antes, se les vuelva a preguntar.

### 6.2 Analítica: `src/lib/analytics.ts`

Es el único punto del proyecto que sabe cómo hablar con Google Analytics, Google Ads y Meta Pixel. Reglas que sigue siempre:

- **No carga nada hasta que hay consentimiento**: Google Analytics solo se activa si el visitante aceptó la categoría "Analíticas"; Google Ads y Meta Pixel, solo si aceptó "Marketing".
- **Se desactiva automáticamente en local**: en `npm run dev` y `npm run preview` estos scripts nunca se cargan (para no ensuciar tus estadísticas reales), salvo que definas `PUBLIC_ANALYTICS_DEBUG=true` en tu `.env` para probarlo a propósito.
- **Una sola función para todo el sitio**: `trackEvent({ name: '...' })`. Ya está conectada a estos eventos estándar:

| Evento | Cuándo se dispara |
|---|---|
| `form_submit` | Al enviarse correctamente el formulario de contacto |
| `whatsapp_click` | Al pulsar el botón flotante de WhatsApp o cualquier enlace a `wa.me` |
| `phone_click` | Al pulsar cualquier enlace `tel:` (ej. los iconos de contacto del header/footer) |
| `email_click` | Al pulsar cualquier enlace `mailto:` |
| `cta_click` | Al pulsar el botón principal de los 3 componentes de `src/components/cta/` |

  Estos tres últimos se detectan **automáticamente en toda la web**, sin tener que tocar nada: `trackEvent` nunca envía nada a ningún sitio si no hay consentimiento (ni siquiera se ve el aviso en la consola de desarrollo).

- **Para añadir tracking a un botón propio**, usa el prop `track` de `Button.astro`:

  ```astro
  <Button href="/contact" track="cta_click" trackLabel="Botón hero portada">Contáctanos</Button>
  ```

- **Nunca se envían datos personales**: no pases nombres, emails, teléfonos ni el contenido de mensajes como `params` de `trackEvent` — la función además descarta automáticamente, como red de seguridad, cualquier valor que parezca un email o un número largo de dígitos.

### 6.3 Bloquear mapas, vídeos u otros contenidos de terceros

`src/components/ui/ConsentGate.astro` es un componente genérico que **no deja que se cargue nada** (ni siquiera la petición de red del `<iframe>`) hasta que el visitante acepta la categoría de cookies necesaria. Ya están listos para usar:

- `src/components/media/MapEmbed.astro` → mapa de Google Maps con la dirección de `business.address` (o la que le pases). Ya está añadido en `src/pages/contact.astro`.
- `src/components/media/YoutubeEmbed.astro` → vídeo de YouTube, dado un `videoId`.

Ejemplo de uso en cualquier página:

```astro
import { MapEmbed, YoutubeEmbed } from '../components/media';

<MapEmbed />
<YoutubeEmbed videoId="dQw4w9WgXcQ" title="Vídeo de presentación" />
```

Hasta que el visitante acepta, se muestra un aviso ("Este contenido lo proporciona un servicio externo...") con un botón para aceptar y mostrarlo al momento — sin tener que ir al panel de preferencias. Si quieres proteger cualquier otro embed de terceros de la misma forma, envuélvelo en `<ConsentGate category="marketing">...</ConsentGate>`.

**Sobre el mapa concretamente**: `MapEmbed` funciona de fábrica sin ninguna clave (usa la URL pública y gratuita de `google.com/maps`). Si prefieres usar la API oficial de Google ("Maps Embed API", más estable a largo plazo), añade `PUBLIC_GOOGLE_MAPS_API_KEY` en tu `.env` — `MapEmbed` la coge automáticamente de `src/config/integrations.ts` y cambia de URL sin que haya que tocar nada más. Instrucciones para crear esa clave en `.env.example`.

### 6.4 Cómo activar Google Analytics, Google Ads o Meta Pixel

No hace falta tocar código. Solo añade el ID correspondiente como variable de entorno (ver [sección 7](#7-variables-de-entorno)):

1. **Google Analytics 4**: crea una propiedad en [analytics.google.com](https://analytics.google.com), copia el ID de medición (`G-XXXXXXXXXX`) y ponlo en `PUBLIC_GA_MEASUREMENT_ID`.
2. **Google Ads**: en [ads.google.com](https://ads.google.com), en la acción de conversión que quieras medir, copia el ID (`AW-XXXXXXXXX`) y ponlo en `PUBLIC_GOOGLE_ADS_ID`.
3. **Meta Pixel**: en el [Administrador de eventos de Meta](https://business.facebook.com/events_manager), copia el ID de tu píxel y ponlo en `PUBLIC_META_PIXEL_ID`.

Solo se activará el que tenga un ID configurado, y solo cuando el visitante dé el consentimiento correspondiente.

---

## 7. SEO técnico: idioma, sitemap, robots.txt y datos estructurados

Todo lo que necesita un buscador para entender, indexar y mostrar bien la web viene ya configurado y conectado a `src/config/business.ts` — no hay que instalar ni tocar nada más para que funcione, solo revisar los puntos marcados como "según tu negocio".

### 7.1 Idioma (`<html lang>` y `og:locale`)

Se define en un único sitio: `business.language` (ver [sección 4.1](#41-datos-de-la-empresa--srcconfigbusinessts)), en formato `es-ES`/`es`/`en-US`. A partir de ahí, `src/lib/seo.ts` genera automáticamente:

- `<html lang="es-ES">` en `BusinessLayout.astro`.
- `<meta property="og:locale" content="es_ES">` (formato con guion bajo que exigen Facebook/WhatsApp).

Este starter es **monolingüe** (una sola versión de idioma). Si en el futuro creas una versión en otro idioma de la misma web, ese es el momento de añadir etiquetas `hreflang` — no hace falta antes, y añadirlas sin tener contenido real en otro idioma sería contraproducente para el SEO.

### 7.2 Título, descripción, canonical y redes sociales de cada página

Cada página define su propio SEO al usar `BusinessLayout`:

```astro
<BusinessLayout
  title="Servicios"
  description="Descubre los servicios que ofrecemos."
  {/* Opcionales — casi nunca hace falta tocarlos: */}
  noindex={false}
  image={{ src: '/img/mi-foto.jpg', alt: 'Descripción de la foto' }}
>
```

- `title`/`description`: obligatorios, deben ser **únicos por página** (nunca copies el mismo texto de otra página) — se usan tanto en la pestaña del navegador como al compartir en redes.
- **Canonical**: se calcula automáticamente a partir de la URL real de cada página (`business.siteUrl` + su ruta), sin parámetros ni barra final — nunca hace falta escribirlo a mano. Solo existe un prop `canonical` para el caso raro de una página que deba apuntar a otra como su versión "oficial".
- `noindex`: ya activado en las páginas de `/demos` y en `/thank-you` (no son contenido que deba aparecer en buscadores). Actívalo en cualquier página nueva que no quieras que Google indexe.
- `image`: imagen que se muestra al compartir esa página en redes sociales (WhatsApp, Facebook, Twitter/X...); si no se indica, se usa `public/social-images/social-default.webp` (ver [sección 4.4](#44-logo-e-imágenes--carpeta-public)).

Toda esta lógica vive en `src/lib/seo.ts` (cálculos) y `src/components/ui/SeoHead.astro` (las etiquetas `<head>` en sí: title, description, canonical, robots, Open Graph y Twitter Cards) — no deberías necesitar tocar ninguno de los dos archivos.

### 7.3 Sitemap y robots.txt

Se generan solos en cada `npm run build`, a partir de `business.siteUrl` — no hay archivos estáticos que mantener a mano:

- **`/sitemap-index.xml`**: generado por la integración oficial `@astrojs/sitemap` (configurada en `astro.config.mjs`) a partir de todas las páginas reales del proyecto. Excluye automáticamente `/demos/*` y `/thank-you`.
- **`/robots.txt`**: generado por `src/pages/robots.txt.ts`. Bloquea `/api/` (rutas internas), `/demos` y `/thank-you`, y apunta al sitemap de arriba.

Cuando publiques la web, da de alta el dominio en **[Google Search Console](https://search.google.com/search-console)** (gratuito) y envía la URL `https://tudominio.es/sitemap-index.xml` para que Google la rastree cuanto antes.

### 7.4 Datos estructurados (JSON-LD)

Ayudan a que Google muestre resultados enriquecidos (rich results): estrellas, horarios, migas de pan, preguntas desplegables directamente en el buscador, etc. Todos están en `src/components/seo/`:

| Componente | Dónde se usa | Qué describe |
|---|---|---|
| `OrganizationSchema.astro` | Siempre, en `BusinessLayout.astro` (ninguna acción necesaria) | Identidad de la empresa: nombre, logo, contacto, redes sociales |
| `LocalBusinessSchema.astro` | `src/pages/index.astro` | Negocio con ubicación física: dirección, teléfono y horario (a partir de `business.address`/`business.hours`). **Bórralo de `index.astro` si tu negocio no tiene local físico que visiten clientes** — `OrganizationSchema` ya cubre el resto de casos. Admite un prop `type` para un tipo más específico (`"Restaurant"`, `"Dentist"`, `"ProfessionalService"`...) |
| `ServiceSchema.astro` | `src/pages/services/[slug].astro` (ya conectado a cada servicio) | Nombre, descripción e imagen de cada servicio |
| `FaqSchema.astro` | `src/pages/services.astro` (ya conectado a las preguntas de `faqContent.ts`) | Preguntas frecuentes — **solo debe usarse en una página que también muestre esas mismas preguntas visibles**, nunca con contenido oculto |
| `Breadcrumbs.astro` (en `src/components/ui/`) | Todas las páginas con migas de pan | Ruta de navegación (Inicio > Servicios > ...) |

Después de publicar, valida cada tipo de página con la [Prueba de resultados enriquecidos de Google](https://search.google.com/test/rich-results) pegando su URL real, para confirmar que no hay avisos.

### 7.5 Favicon, manifest e imagen social

- `src/pages/site.webmanifest.ts` genera el manifest de la web (nombre, colores, icono) a partir de `business.ts` — solo incluye el icono SVG por defecto; añade PNGs reales si quieres soporte completo de icono en pantalla de inicio/PWA (ver [sección 4.4](#44-logo-e-imágenes--carpeta-public)).
- `public/social-images/social-default.webp` es la imagen que se ve al compartir la web (1200×630px) — sustitúyela por una real de tu marca antes de publicar.
- `src/pages/404.astro` es la página que se muestra cuando alguien visita una URL que no existe.

### 7.6 Si cambias la URL de una página (slugs)

Si renombras la URL de un servicio o de cualquier otra página después de que la web ya esté publicada e indexada, añade una redirección en `astro.config.mjs` para no perder las visitas ni el posicionamiento de la URL antigua:

```js
// astro.config.mjs
redirects: {
  '/services/nombre-antiguo': '/services/nombre-nuevo',
},
```

---

## 8. Variables de entorno

Se configuran en el archivo `.env` (local) o en el panel de Vercel (producción). Plantilla completa en `.env.example`.

| Variable | Obligatoria | Descripción |
|---|---|---|
| `RESEND_API_KEY` | **Sí, en producción** | Clave de API de Resend. Sin ella en producción, el formulario no envía y avisa del error (nunca finge éxito). En local es opcional. |
| `CONTACT_FROM_EMAIL` | **Sí, en producción** | Remitente del email, con el formato `Mi Empresa <formularios@miempresa.es>`, usando un dominio verificado en Resend. |
| `CONTACT_TO_EMAIL` | No | Bandeja donde llegan los mensajes del formulario. Si se deja vacía, se usa `business.email` de `src/config/business.ts`. |
| `PUBLIC_GA_MEASUREMENT_ID` | No | ID de medición de Google Analytics 4 (`G-XXXXXXXXXX`). Sin él, GA4 nunca se carga (ver [sección 6](#6-cookies-consentimiento-y-analítica-ga4-google-ads-meta-pixel)). |
| `PUBLIC_GOOGLE_ADS_ID` | No | ID de conversión de Google Ads (`AW-XXXXXXXXX`). Sin él, Google Ads nunca se carga. |
| `PUBLIC_META_PIXEL_ID` | No | ID del píxel de Meta (Facebook/Instagram). Sin él, el píxel nunca se carga. |
| `PUBLIC_ANALYTICS_DEBUG` | No | Ponla a `true` solo para probar en local (`npm run dev`/`preview`) que GA4/Ads/Meta Pixel cargan correctamente. Déjala vacía el resto del tiempo. |
| `PUBLIC_GOOGLE_MAPS_API_KEY` | No | El mapa de la página de contacto (`MapEmbed`) funciona sin ella (embed gratuito de Google). Añádela para que use en su lugar la API oficial "Maps Embed API" de Google (ver [sección 6.3](#6-cookies-consentimiento-y-analítica-ga4-google-ads-meta-pixel) y `.env.example`). |
| `SKIP_CONFIG_GUARD` | No | Ponla a `true` solo para saltarte a propósito el aviso de "faltan datos reales en `business.ts`" que bloquea `npm run build` (ver [sección 13.4](#13-arquitectura-interna-temas-configuración-layouts-y-componentes-compartidos)) — por ejemplo, para un build de demo/staging. |

Solo `RESEND_API_KEY` y `CONTACT_FROM_EMAIL` son obligatorias para producción; todo lo demás (incluida la analítica) es opcional y el resto de la web (textos, imágenes, diseño) no necesita ningún otro servicio externo.

---

## 9. Qué necesitas para tener una web 100% real en producción

Checklist de todo lo que hay que tener/decidir para pasar de "starter de ejemplo" a "web real de un negocio":

### Imprescindible

- [ ] **Un dominio propio** (ej. `miempresa.es`), comprado en cualquier proveedor (Namecheap, GoDaddy, IONOS, OVH, el mismo Vercel, etc.).
- [ ] **Una cuenta en [Vercel](https://vercel.com)** (gratuita para empezar) para publicar la web — ver [sección 10](#10-cómo-publicar-la-web-vercel).
- [ ] **Una cuenta en [Resend](https://resend.com)** con el dominio verificado, para que el formulario de contacto envíe emails de verdad (ver [sección 5](#5-el-formulario-de-contacto-envío-de-emails-reales)).
- [ ] **Datos reales de la empresa**: nombre comercial, razón social, NIF/CIF, dirección fiscal, email y teléfono de contacto → van en `src/config/business.ts` y en las páginas legales.
- [ ] **Textos legales reales**: las páginas de `src/pages/legal/` son plantillas incompletas a propósito, con un aviso visible y campos entre corchetes (ej. `[NIF/CIF DE LA EMPRESA]`) — sustitúyelos todos por los datos reales, adaptados a tu país y actividad. Si tienes dudas legales (RGPD, LSSI-CE en España, etc.), consúltalo con una gestoría o abogado — no es algo que el código pueda decidir por ti.
- [ ] **Logo en buena calidad** (PNG o SVG con fondo transparente) para `public/logos/logo.png`.
- [ ] **Favicon** propio (`public/favicon.ico` / `.svg`).
- [ ] **`siteUrl` y `language` reales** en `src/config/business.ts` — de `siteUrl` dependen el sitemap, el `robots.txt`, el canonical y todos los datos estructurados (ver [sección 7](#7-seo-técnico-idioma-sitemap-robotstxt-y-datos-estructurados)); no debe quedar el `https://example.com` de ejemplo.

### Recomendable

- [ ] **Cuentas de redes sociales reales** (Instagram, Facebook, LinkedIn...) para rellenar `business.social`.
- [ ] **Número de WhatsApp Business** en formato internacional, si vas a usar el botón flotante de WhatsApp.
- [ ] **Google Search Console** (gratuito) — para que Google indexe la web. Se da de alta añadiendo tu dominio en [search.google.com/search-console](https://search.google.com/search-console), verificando la propiedad, y enviando la URL `https://tudominio.es/sitemap-index.xml` (ver [sección 7.3](#7-seo-técnico-idioma-sitemap-robotstxt-y-datos-estructurados)).
- [ ] **Imagen social real** (`public/social-images/social-default.webp`, 1200×630px) en vez de la genérica de ejemplo, para que se vea bien al compartir la web en WhatsApp/redes sociales.
- [ ] **Google Analytics 4, Google Ads y/o Meta Pixel**, si quieres medir visitas o conversiones — ya están integrados y listos para usar (ver [sección 6](#6-cookies-consentimiento-y-analítica-ga4-google-ads-meta-pixel)); solo hace falta añadir el ID correspondiente como variable de entorno.
- [ ] **Fotos reales del negocio/equipo**, en vez de las imágenes de ejemplo (`public/img/fallback.webp`).
- [ ] Revisar las páginas de demostración (`src/pages/demos/`): en producción ya se excluyen del build y del menú automáticamente. Si no las vas a necesitar ni en local, puedes borrar la carpeta.

### Opcional (según necesidad)

- [ ] **CAPTCHA adicional** (ej. Cloudflare Turnstile) si el formulario de contacto recibe mucho spam a pesar de la protección incluida por defecto (instrucciones dentro de `.env.example`).
- [ ] Revisar las categorías y textos del panel de cookies (`src/config/cookieConsentContent.ts`) si tu web usa servicios distintos a los ya soportados (GA4, Google Ads, Meta Pixel, mapas/vídeos incrustados).

---

## 10. Cómo publicar la web (Vercel)

Este starter está preparado para desplegarse en [Vercel](https://vercel.com) (el mismo equipo que mantiene Next.js, con plan gratuito más que suficiente para una web corporativa).

1. Sube el proyecto a un repositorio de GitHub (o GitLab/Bitbucket).
2. Entra en [vercel.com](https://vercel.com) → **Add New → Project** → selecciona tu repositorio.
3. Vercel detecta automáticamente que es un proyecto Astro; no hace falta tocar nada en la configuración de build.
4. Antes de darle a "Deploy", ve a **Environment Variables** y añade:
   - `RESEND_API_KEY`
   - `CONTACT_FROM_EMAIL`
   - `CONTACT_TO_EMAIL`
   - Opcionalmente, si vas a medir visitas/conversiones: `PUBLIC_GA_MEASUREMENT_ID`, `PUBLIC_GOOGLE_ADS_ID` y/o `PUBLIC_META_PIXEL_ID`.
5. Haz clic en **Deploy**. En 1-2 minutos tendrás una URL pública tipo `tu-proyecto.vercel.app`.
6. Ve a **Settings → Domains** y añade tu dominio propio (ej. `miempresa.es`). Vercel te indicará qué registros DNS añadir en tu proveedor de dominio.
7. A partir de ahora, cada vez que subas cambios a la rama principal del repositorio, Vercel vuelve a publicar la web automáticamente.

---

## 11. Comandos disponibles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Arranca el servidor de desarrollo en local (con recarga automática; incluye `/demos`) |
| `npm run build` | Genera la versión final optimizada (excluye `/demos` por defecto) |
| `npm run build:with-demos` | Igual que `build`, pero mantiene la galería `/demos` (útil en staging) |
| `npm run preview` | Sirve en local el resultado de `npm run build`, para comprobarlo antes de publicar |
| `npm run check` | Revisa que no haya errores de tipos/código en el proyecto |

---

## 12. Checklist final antes de publicar

- [ ] `src/config/business.ts` con los datos reales de la empresa, incluido `siteUrl` (dominio real) y `language`
- [ ] Logo, favicon e imagen social (`public/social-images/social-default.webp`) reales en `public/`
- [ ] Todos los textos de `src/config/*Content.ts` revisados (sin texto de ejemplo en inglés)
- [ ] Páginas legales (`src/pages/legal/`) con contenido legal real: **sin ningún campo entre corchetes** ni el aviso de "plantilla incompleta" visible
- [ ] Categorías y textos del panel de cookies (`cookieConsentContent.ts`) revisados y acordes a lo que realmente usa tu web
- [ ] Páginas de `src/pages/demos/`: no hace falta borrarlas (el build de producción las excluye solo); bórralas solo si ya no las necesitas ni en local
- [ ] Lighthouse Mobile en `/`, `/services` y `/contact` sin errores graves de LCP/CLS (ver [sección 16](#16-rendimiento-fuentes-cssjs-y-core-web-vitals))
- [ ] `LocalBusinessSchema` revisado en `src/pages/index.astro` (bórralo si el negocio no tiene local físico) y cada tipo de página validado en la [Prueba de resultados enriquecidos de Google](https://search.google.com/test/rich-results)
- [ ] `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` y `CONTACT_TO_EMAIL` configuradas en Vercel
- [ ] Formulario de contacto probado enviando un email real de prueba
- [ ] Si usas analítica: `PUBLIC_GA_MEASUREMENT_ID`/`PUBLIC_GOOGLE_ADS_ID`/`PUBLIC_META_PIXEL_ID` configuradas en Vercel y probadas aceptando cada categoría de cookies
- [ ] Dominio propio conectado en Vercel, y sitemap (`/sitemap-index.xml`) enviado a Google Search Console
- [ ] `npm run build` y `npm run check` ejecutados sin errores (si `business.ts` aún tiene datos de ejemplo, `npm run build` fallará a propósito — ver [sección 13.4](#13-arquitectura-interna-temas-configuración-layouts-y-componentes-compartidos))

---

## 13. Arquitectura interna: temas, configuración, layouts y componentes compartidos

Esta sección es para quien vaya a tocar la estructura interna del proyecto (no solo el contenido) — explica varias decisiones de arquitectura tomadas a propósito, para que se mantengan coherentes según el starter vaya creciendo.

### 13.1 Una sola fuente de verdad para el diseño: `src/styles/tokens.css`

Todo el diseño (colores, tipografías, radio de bordes, espaciados y ancho máximo de contenido) vive **únicamente** en `src/styles/tokens.css`, como variables CSS estándar (`--color-primary`, `--font-base`, `--radius-base`, `--max-width`...). Los componentes usan siempre `var(--nombre-variable)`, nunca un valor de color/tamaño escrito a mano.

No existe un `theme.ts` en paralelo — existió en versiones antiguas del starter, pero no lo usaba ningún componente y sus valores podían quedar desincronizados de `tokens.css`, así que se eliminó. Para cambiar el diseño del sitio:

1. Abre `src/styles/tokens.css`.
2. Cambia el valor de la variable que quieras (por ejemplo `--color-primary: #0d9488;` por tu color de marca).
3. Guarda — el cambio se aplica en toda la web al momento con `npm run dev`, sin tocar ningún componente.

### 13.2 Qué archivo de configuración usar para qué

`src/config/` separa la configuración **técnica/global** de los **textos de cada sección**, para que cada archivo tenga una única responsabilidad clara:

| Archivo | Para qué es |
|---|---|
| `business.ts` | Identidad de la empresa: nombre, contacto, dirección, horario, redes sociales, dominio (`siteUrl`) e idioma |
| `navigation.ts` | Menús: navegación principal, legal, de demos, y el enlace de "Gestionar cookies" |
| `seo.ts` | Valores por defecto técnicos de SEO/redes sociales: separador de `<title>`, tipo de Open Graph, tipo de tarjeta de Twitter/X e imagen social por defecto — **no** confundir con textos de contenido |
| `integrations.ts` | IDs de proveedores externos leídos de `import.meta.env` (Google Analytics, Google Ads, Meta Pixel, Google Maps) — el único sitio del proyecto que lee esas variables `PUBLIC_...`, consumido por `src/lib/analytics.ts` y `src/components/media/MapEmbed.astro` |
| `theme` (diseño) | No es un archivo `.ts` — es `src/styles/tokens.css` (ver 13.1) |
| El resto de archivos (`heroContent.ts`, `servicesContent.ts`, `teamContent.ts`, etc.) | Textos y datos de contenido de cada sección — ver [sección 4.5](#45-textos-de-cada-sección) |

Regla general al añadir configuración nueva: si es un **texto o dato que cambia según la empresa/sección**, va en un archivo de contenido (`xContent.ts`); si es un **valor técnico que afecta a cómo funciona el sitio** (una URL de API, un formato, un ID de proveedor), va en `business.ts`, `seo.ts` o `integrations.ts` según corresponda — nunca mezclado dentro de un archivo de contenido.

### 13.3 Contenido: archivos TypeScript, no Content Collections

Este starter gestiona `services`, `team`, `testimonials`, etc. como **arrays de TypeScript** en `src/config/*Content.ts`, no como [Content Collections](https://docs.astro.build/en/guides/content-collections/) de Astro. Es una decisión deliberada, no una migración a medias:

- Los datos de una web de empresa (servicios, equipo, testimonios) cambian con poca frecuencia y los edita normalmente quien mantiene el código, no un equipo de redacción — un array tipado en TypeScript, con autocompletado y comprobación de tipos vía `npm run check`, es más simple que añadir un sistema de colecciones con sus propios esquemas.
- Si en el futuro añades un blog con posts frecuentes editados por alguien sin conocimientos técnicos, ese es el momento de introducir Content Collections (creando `src/content.config.ts` con sus esquemas) — solo para ese tipo de contenido, sin migrar el resto.

Si eliges esa vía más adelante, valida siempre `slug` (único), imágenes, orden de aparición, estado de publicación y los campos obligatorios de cada entrada en el esquema de la colección.

### 13.4 Aviso de configuración incompleta al hacer build de producción

`astro.config.mjs` incluye una comprobación (`src/lib/configCheck.ts`) que **bloquea `npm run build`** si `src/config/business.ts` todavía tiene alguno de los valores de ejemplo del starter (`"Business Name"`, `"https://example.com"`, `"info@example.com"`, la dirección de ejemplo...). Esto evita el error, fácil de cometer, de publicar la web con datos de mentira porque se olvidó rellenar `business.ts`.

- Solo afecta a `npm run build` (y por tanto al build que hace Vercel al desplegar) — nunca a `npm run dev` ni `npm run preview`, así que no molesta durante el desarrollo.
- Si el build falla, el propio mensaje de error lista exactamente qué campos de `business.ts` hay que corregir.
- Para un build de demostración/staging que a propósito siga mostrando datos de ejemplo, puedes saltarte la comprobación con `SKIP_CONFIG_GUARD=true npm run build`.

### 13.5 Layouts disponibles

Todas las páginas parten de `src/layouts/BusinessLayout.astro` (SEO del `<head>`, header, footer, cookies, WhatsApp, botón "volver arriba" y arranque de analítica). Sobre esa base hay tres layouts más específicos, para no repetir la misma estructura en cada página:

| Layout | Para qué páginas | Qué añade sobre `BusinessLayout` |
|---|---|---|
| `BusinessLayout` | Páginas con su propio Hero (ej. `index.astro`) | Nada más — es la base |
| `PageLayout` | Páginas "interiores" sin Hero propio (ej. `about.astro`, `services.astro`) | Migas de pan (`breadcrumbs` prop) y un único `<h1>` automático vía `PageHeader` |
| `LegalLayout` | Páginas de `src/pages/legal/` | Migas de pan, el aviso de "plantilla incompleta" y el `<h1>` + fecha de "última actualización" |
| `ServiceLayout` | Páginas de servicio (`src/pages/services/[slug].astro`) | El JSON-LD `ServiceSchema` y las migas de pan Inicio > Servicios > {servicio} |

**Elegir header/footer sin editar el layout**: los cuatro layouts admiten sustituir el header o el footer por otra de las 5 variantes de cada uno, pasándolos como hijos con `slot="header"`/`slot="footer"` — sin tocar ningún archivo de `src/layouts/`:

```astro
<BusinessLayout title="...">
  <HeaderCta slot="header" />
  <FooterCta slot="footer" />
  ...contenido de la página...
</BusinessLayout>
```

Si no se pasa ninguno, se usan por defecto `HeaderSimple`/`FooterColumns`.

### 13.6 Componentes compartidos para evitar duplicación

Dos piezas de UI se repetían, con markup casi idéntico, en decenas de componentes — se extrajeron a `src/components/ui/` para que cada variante mantenga su propio diseño/CSS pero sin duplicar la lógica:

- **`SectionHeading.astro`**: el bloque "eyebrow + título + descripción" que encabeza casi todas las secciones (hero, servicios, equipo, testimonios, FAQ, CTA, contacto, texto+imagen). Cada componente le sigue pasando sus propias clases CSS (`eyebrowClass`, `titleClass`, `descriptionClass`), así que el diseño de cada variante no cambia — solo se comparte el "cómo" se renderizan esos tres elementos.
- **`BrandMark.astro`**: el logo (imagen, o el nombre del negocio como texto si no hay logo configurado) que aparece en los 5 estilos de header y los 5 de footer. Cada header/footer conserva su propio enlace `<a href="/">` y sus propias clases de tamaño/posición alrededor de `BrandMark`.

Si al añadir una variante nueva detectas que estás repitiendo un bloque de markup que ya existe en 3 o más componentes, es buena señal de que merece su propio componente en `src/components/ui/` siguiendo este mismo patrón — recibiendo solo los datos y las clases CSS necesarias, sin imponer su propio estilo.

---

## 14. Accesibilidad

El starter sigue las pautas WCAG 2.1 nivel AA de serie. Si añades componentes nuevos o modificas los existentes, mantén estos criterios:

### 14.1 Navegación por teclado

- **Foco visible**: `src/styles/global.css` define un anillo de foco global vía `:focus-visible` (`outline: 2px solid var(--color-primary)`), que se aplica automáticamente a cualquier enlace, botón o control nuevo. Si necesitas quitar el `outline` por diseño en un componente concreto, sustitúyelo siempre por otra señal visible igual de clara (borde, sombra...) — nunca lo elimines sin más. Ejemplos ya resueltos así: `FormField.astro` (borde + sombra) y `ContactMinimal.astro` (fondo de color).
- **`SkipLink.astro`** (`src/components/ui/SkipLink.astro`): enlace "Saltar al contenido principal", invisible hasta que recibe el foco (primer `Tab` de cada página), que salta a `<main id="main-content">`. Ya está incluido en `BusinessLayout.astro`; no hace falta añadirlo en cada página.
- Ningún control del proyecto usa `tabindex` positivo (rompería el orden natural de tabulación). El único `tabindex="-1"` que existe es intencional: el campo honeypot anti-spam del formulario (no debe ser alcanzable) y el contenedor de estado del formulario (se enfoca por script tras enviar, no por tabulación).

### 14.2 Menú móvil (`NavMenu.astro`)

- El botón hamburguesa tiene `aria-label` en español ("Abrir menú de navegación" / "Cerrar menú de navegación", según el estado) y `aria-expanded` sincronizado.
- El menú se cierra con `Escape` (devolviendo el foco al botón), al hacer clic fuera del menú, y al seleccionar cualquier enlace (incluidos los del submenú).
- Los enlaces del menú marcan `aria-current="page"` automáticamente cuando coinciden con la URL actual (comparando contra `Astro.url.pathname`).
- Los submenús (p. ej. "Demos") tienen su propio botón de expandir/colapsar con `aria-expanded`/`aria-controls`, independiente del `:hover` — en escritorio el desplegable se sigue abriendo también al pasar el ratón o al enfocar con teclado (`:focus-within`), pero en móvil (sin ratón) el único mecanismo es ese botón explícito.

### 14.3 Formularios accesibles (`src/components/forms/`)

- **Labels**: todo campo (`FormField.astro`, `ConsentCheckbox.astro`) usa `<label for="...">` asociado al `id` real del control — nunca placeholder-only.
- **Errores**: cada campo tiene `aria-describedby` apuntando a su mensaje de error y `aria-invalid` cuando falla la validación; al enviar con errores, el foco se mueve automáticamente al primer campo inválido (`ContactForm.astro`), así el lector de pantalla anuncia el error sin que el usuario tenga que buscarlo. El resumen de éxito/error del envío (`FormStatus.astro`) usa `role="status"` + `aria-live="polite"`.
- **`autocomplete`**: `FormField.astro` asigna automáticamente `name`, `email`, `tel` u `organization` según el nombre del campo (sobreescribible con la prop `autocomplete`).
- **Orden de tabulación**: siempre el orden natural del DOM — no hay `tabindex` positivo en ningún formulario.
- **Contraste**: los bordes de `input`/`textarea` y del botón `outline` usan `var(--color-text-muted)` (no `var(--color-border)`, demasiado claro) para cumplir el contraste mínimo 3:1 que exige WCAG para los límites de un control interactivo. El `::placeholder` global también fija ese mismo color con `opacity: 1` (Firefox lo atenúa por defecto).

### 14.4 Componentes interactivos

- **`Accordion.astro`** usa `<details>`/`<summary>` nativos — el navegador y los lectores de pantalla exponen el estado expandido/colapsado automáticamente, sin necesidad de gestionar `aria-expanded` a mano.
- **`BackToTop.astro`** y **`WhatsappButton.astro`** llevan `aria-label` en español ("Volver arriba", "Chatear por WhatsApp") y heredan el anillo de foco global.
- **`Icon.astro`** se marca `aria-hidden="true"` automáticamente salvo que se le pase una prop `label` — así ningún icono decorativo se anuncia dos veces cuando ya vive dentro de un botón/enlace con su propio `aria-label` o junto a texto visible.
- No se usan `<div>`/`<span>` como botones en ningún componente: todo elemento clicable es un `<a>` o un `<button>` real.

### 14.5 Contenido y estructura

- Landmarks semánticos en todo el sitio: `<header>`, `<nav aria-label="...">`, `<main id="main-content">`, `<footer>`.
- Un único `<h1>` por página (lo aporta el `Hero`/`PageHeader` de cada página) y jerarquía `h2`/`h3` respetada por `SectionHeading.astro` (`as="h2"` por defecto, `"h3"` para tarjetas).
- `<html lang>` se fija dinámicamente desde `business.language` (ver sección 7.1) — no hay ningún `lang` hardcodeado.
- `Breadcrumbs.astro` marca la página actual con `aria-current="page"` y el `<nav>` lleva `aria-label="Migas de pan"`.

### 14.6 Movimiento y preferencias

- `src/styles/global.css` incluye una regla `@media (prefers-reduced-motion: reduce)` que reduce a prácticamente cero la duración de cualquier `transition`/`animation` CSS del sitio (dropdowns, botón "volver arriba", banner de cookies, acordeón...) para quien tiene activada esa preferencia del sistema operativo.
- El scroll suave disparado por JavaScript (`BackToTop.astro`) comprueba `window.matchMedia('(prefers-reduced-motion: reduce)')` antes de pedir `behavior: "smooth"`, porque un valor explícito por script no siempre respeta la preferencia del SO solo con CSS.
- Ningún componente mueve el foco de forma inesperada; los únicos cambios de foco programáticos (abrir el modal de cookies, enfocar el primer campo inválido de un formulario, cerrar el menú móvil con `Escape`) son respuestas directas a una acción del propio usuario.

Si añades un componente nuevo con foco, animación o interacción propia, revisa esta lista antes de darlo por terminado.

---

## 15. Imágenes: rendimiento y carga

Todas las fotos del sitio (equipo, testimonios, servicios, tarjetas, visuales de hero...) pasan por un único componente, `src/components/media/ResponsiveImage.astro`, en vez de escribir `<img>` a mano en cada sitio.

### 15.1 Por qué un componente propio y no `astro:assets`

`astro:assets` (el `<Image>`/`<Picture>` de Astro) solo optimiza imágenes que puede ver en su grafo de build, es decir, archivos importados desde `src/`. En este starter, en cambio, **todas** las fotos vienen de una ruta en texto dentro de un archivo de configuración (`business.logo`, `team[].image`, `services[].image`...) que vive en `public/`, precisamente para que se pueda cambiar una foto sustituyendo un archivo y editando una ruta, sin tocar código ni imports. Migrar todo el sitio a `astro:assets` habría significado convertir cada una de esas rutas en un import — rompiendo esa simplicidad.

`ResponsiveImage.astro` es la alternativa: un `<img>` fino y predecible que sí resuelve, en todo el sitio, lo que de verdad importa para rendimiento:

- **`width`/`height` obligatorios** — el navegador reserva el hueco correcto antes de que la imagen cargue, evitando que el resto de la página "salte" al terminar de cargar (esto es el *Cumulative Layout Shift* o CLS, una de las métricas Core Web Vitals de Google).
- **`loading="lazy"` + `decoding="async"` por defecto** en todas las fotos, para no bloquear la carga inicial de la página con imágenes que ni siquiera son visibles todavía (más abajo del scroll).
- **Prop `priority`** para la *única* imagen de cada página que sea su candidata a LCP (*Largest Contentful Paint*, la otra gran métrica Core Web Vitals) — normalmente el visual del hero. Con `priority` pasa a `loading="eager"` + `fetchpriority="high"`, para que el navegador la descargue inmediatamente en vez de esperar a "descubrirla" durante el renderizado. Ya está activado por defecto en `HeroSplit` (`priority={true}`) y en la imagen de `services/[slug].astro`; pásalo también en `TextImage`/`CardImage` si alguna instancia concreta queda justo debajo del hero, visible sin hacer scroll.
- **Fallback automático si una imagen falla**: si el archivo de una foto no existe o no carga, se sustituye al vuelo por `public/img/fallback.webp` (o, en el caso del logo, por el SVG placeholder) en vez de mostrar el icono de "imagen rota" del navegador. Lo gestiona `src/lib/imageFallback.ts`, ya conectado en `BusinessLayout.astro` — no requiere nada por tu parte.
- **`sizes`/`srcset` opcionales**: si para una foto concreta sí tienes varias resoluciones reales (por ejemplo, exportaste un hero a 800px y a 1600px de ancho), puedes pasarlas con las props `srcset`/`sizes` de `ResponsiveImage` para que el navegador elija la más adecuada según el dispositivo. El starter no las genera automáticamente porque no reprocesa las fotos que subes a `public/`.

### 15.2 Fallbacks centralizados — `src/config/images.ts`

Antes, la ruta de la imagen de repuesto (`/img/fallback.webp`) estaba copiada a mano en 8 componentes distintos. Ahora vive en un único sitio:

```ts
// src/config/images.ts
export const imageFallbacks = {
  photo: '/img/fallback.webp', // Foto genérica de repuesto (equipo, testimonios, tarjetas...)
  logo: '/logos/logo-fallback.svg', // Solo si un logo configurado falla al cargar
};
```

Sustituye `public/img/fallback.webp` por tu propia foto genérica (por ejemplo, un fondo de marca) y se usará automáticamente en todo el sitio.

### 15.3 Si necesitas optimización real de una imagen concreta

Para una imagen puntual especialmente pesada (p. ej. un fondo de hero muy grande) donde quieras que Astro la reprocese de verdad (recortar, convertir a AVIF/WebP, generar varias resoluciones), es razonable hacer una excepción: mueve solo ese archivo a `src/assets/`, impórtalo, y usa el `<Image>`/`<Picture>` de `astro:assets` directamente en esa página o componente concreto, en vez de `ResponsiveImage`. No es necesario (ni recomendable) hacerlo para el resto del sitio.

---

## 16. Rendimiento: fuentes, CSS/JS y Core Web Vitals

El starter está pensado para puntuar bien en Lighthouse / PageSpeed sin trucos raros. Esta sección resume las decisiones y cómo comprobarlas.

### 16.1 Fuentes

- Por defecto el sitio usa **fuentes de sistema** (`system-ui`) vía `--font-base` / `--font-heading` en `src/styles/tokens.css`: cero bytes descargados, cero layout shift por tipografía.
- Si necesitas una fuente de marca, **self-hostéala** (WOFF2 en `public/fonts/`) siguiendo la guía comentada al inicio de `src/styles/global.css`: `@font-face` con `font-display: swap`, como máximo 2 pesos (p. ej. 400 + 700), y un único `<link rel="preload">` solo del peso crítico (el del texto above-the-fold).
- No uses el CSS de Google Fonts (ni otro `<link>`/`@import` a un CDN de tipografías): añade una petición cross-origin que bloquea el render en cada visita.

### 16.2 CSS y JavaScript

- **CSS inline**: `astro.config.mjs` fija `build.inlineStylesheets: 'always'`. En un sitio de marketing pequeño evita una petición extra de hoja de estilos; el CSS total sigue siendo de pocas decenas de KB.
- **CSS no duplicado entre variantes**: `SectionHeading.astro` centraliza el estilo del *eyebrow* y de la descripción muted. Solo las variantes que necesitan un tratamiento distinto (CTA oscuros, pill del hero centrado, tamaños de hero) pasan `eyebrowClass` / `descriptionClass`.
- **JS mínimo y progresivo**: no hay frameworks de UI en el cliente. Cada componente interactivo (`NavMenu`, `ContactForm`, `CookieConsent`, `BackToTop`, `ConsentGate`) carga su propio `<script>` solo en las páginas que lo usan. El formulario funciona sin JS (`noscript` + `action` real). Analytics no carga nada hasta que hay consentimiento.
- **Demos fuera de producción**: `src/pages/demos/` se excluye automáticamente de `astro build` (se renombra a `_demos` durante el build). El ítem "Demos" del menú tampoco aparece en builds de producción. En local (`astro dev`) sigue disponible. Para un build de staging con la galería: `npm run build:with-demos` (o `INCLUDE_DEMOS=true`).
- **Componentes no usados no llegan al bundle**: Astro solo incluye el CSS/JS de los componentes que una página importa. Las 4 variantes de FAQ que no uses en ninguna página real no se sirven. Por eso excluir demos del build importa: eran el único sitio que importaba muchas variantes "de muestra".

### 16.3 Core Web Vitals — LCP por plantilla

| Página / plantilla | Candidato LCP | Cómo se prioriza |
|---|---|---|
| Home, About, Services, Contact (`HeroBackground`) | Imagen de fondo del hero | `priority` (default `true`) emite `<link rel="preload" as="image" fetchpriority="high">` — necesario porque un `background-image` CSS no se descubre en el preload scan del HTML |
| Página con `HeroSplit` | `<img>` del visual | `ResponsiveImage` con `priority` (default `true`) → `loading="eager"` + `fetchpriority="high"` |
| `/services/[slug]` | Foto del servicio | `ResponsiveImage` con `priority` |
| Resto (tarjetas, equipo, testimonios, TextImage…) | No son LCP | `loading="lazy"` + `decoding="async"` |

Pon `priority={false}` en un segundo hero de la misma página si no es el LCP.

### 16.4 CLS, tareas largas e interacción

- **CLS**: toda foto pasa por `ResponsiveImage` con `width`/`height` obligatorios; el logo declara `logoWidth`/`logoHeight` en `business.ts`; los heroes reservan altura con `min-height` / `--hero-height`.
- **Tareas largas**: el listener de scroll de `BackToTop` está coalescido con `requestAnimationFrame` y es `passive`. Analytics y embeds de terceros no se ejecutan hasta el consentimiento. No hay hidratación de React/Vue.
- **Menú, formulario y cookies**:
  - Menú: cierra con Escape / clic fuera / enlace; submenús con botón explícito (no solo hover).
  - Formulario: validación ligera en cliente, la real en servidor; botón deshabilitado mientras envía; sin doble submit.
  - Consent manager: banner oculto con `hidden` tras decidir (no deja un overlay bloqueando clics); modal con foco y Escape.

### 16.5 Cómo probar (incluido móvil con conexión limitada)

1. `npm run build` y luego `npm run preview`.
2. Chrome DevTools → Lighthouse (Mobile) sobre `/`, `/services`, `/contact`.
3. Para simular 3G: Network → "Slow 3G" (o "Fast 3G") + Performance / Lighthouse.
4. Comprueba en la pestaña Network que:
   - no hay peticiones a fuentes de Google / CDNs de tipografía;
   - no hay rutas `/demos/...`;
   - GA4 / Pixel no cargan hasta aceptar cookies analíticas / marketing.

---

## Documentación adicional de Astro

- [Añadir páginas o rutas](https://docs.astro.build/en/guides/routing/)
- [Componentes de Astro](https://docs.astro.build/en/basics/astro-components/)
- [Estilos y Tailwind](https://docs.astro.build/en/guides/styling/)
- [Despliegue en Vercel](https://docs.astro.build/en/guides/deploy/vercel/)
