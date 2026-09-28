# Operación del CMS

Precios y condiciones consultados el 28 de septiembre de 2026. Vuelven a cambiar: contrasta [tina.io/pricing](https://tina.io/pricing), [colaboradores](https://tina.io/docs/tinacloud/dashboard/users), [flujo editorial](https://tina.io/docs/tinacloud/editorial-workflow) y [Vercel Fair Use](https://vercel.com/docs/limits/fair-use-guidelines) antes de presupuestar.

## TinaCloud

Un proyecto de TinaCloud por cliente, unido a su repositorio. No es una plataforma multicliente.

| Plan (precio de lista en USD, facturación mensual) | Usuarios incluidos | Roles | Flujo editorial |
|---|---|---|---|
| Free, 0 $ | 2 | 2 | No |
| Team, 24 $ / proyecto / mes (290 $ al año) | 3, ampliable | 2 | No |
| Team Plus, 41 $ / proyecto / mes (490 $ al año) | 5, ampliable | 2 | Sí |
| Business, 249 $ / proyecto / mes (2.990 $ al año) | 20, ampliable | 3 (beta) | Sí |
| Enterprise | A medida | A medida | A medida |

La página de precios dice que Free incluye 2 usuarios y 2 roles, con soporte de comunidad. La documentación de colaboradores describe dos roles de proyecto:

| Acción | Admin | Editor |
|---|---|---|
| Editar contenido y guardarlo en Git | Sí | Sí |
| Ver el resumen del proyecto | Sí | Sí |
| Cambiar la configuración del proyecto | Sí | No |
| Gestionar colaboradores | Sí | No |

Con eso, el plan gratuito cabe para una persona de 36WEB (Admin) y el cliente (Editor). No prometas borradores, cola de aprobación ni ramas de revisión en Free ni en Team: el flujo editorial está en Team Plus y superiores. En esos planes, Guardar sobre una rama protegida abre una rama y un pull request; la web pública no cambia hasta que ese pull request se fusiona y el hosting termina el despliegue.

Ocultar un campo en el esquema no es un permiso. El rol es lo que limita el acceso.

## Quién paga y quién entra

- La cuenta de TinaCloud y la factura quedan a nombre de quien cree la organización. Lo habitual en 36WEB es que la agencia sea la titular y el Admin, y que el cliente sea Editor de ese proyecto.
- El repositorio de Git es del cliente (o de la agencia, si el contrato lo dice). TinaCloud necesita permiso para hacer commit en la rama conectada.
- Para dar de baja a alguien: quítalo en Collaborators del proyecto TinaCloud y quítale el acceso al repositorio de Git. Cambiar el rol en el editor no basta si sigue teniendo GitHub.
- Para dar de alta otro cliente: repositorio nuevo, proyecto TinaCloud nuevo, variables nuevas. No reutilices el proyecto de otro cliente.

## Hosting

Vercel Hobby es solo para uso personal no comercial. Una web de cliente, hecha de pago por 36WEB, es uso comercial y necesita Pro o Enterprise. El precio vigente está en [vercel.com/pricing](https://vercel.com/pricing).

El build de producción tiene que poder leer `NEXT_PUBLIC_TINA_CLIENT_ID` y `TINA_TOKEN`. Sin las dos, `npm run build` genera un editor local que no inicia sesión en TinaCloud.

## Copias y restauración

El contenido editorial son los JSON de `content/` y las fotos de `public/uploads/`. La copia es el historial de Git. No hay una base de datos aparte que exportar.

Para volver atrás:

1. Revierte el commit del contenido en Git (o recupera los archivos desde un commit anterior).
2. Espera al despliegue de ese commit, o vuelve a desplegarlo.
3. Comprueba la URL pública.

En Vercel, el despliegue anterior sigue disponible. Promocionar ese despliegue recupera la web publicada sin esperar a un commit nuevo, pero el repositorio seguiría teniendo el contenido nuevo: el siguiente build lo volvería a publicar. Hay que revertir Git y el despliegue a la par.

## Si la publicación falla

Guardar en Tina no significa que la web ya esté actualizada.

1. Mira que el commit exista en GitHub.
2. Mira el despliegue del hosting. Si está en error, la web pública sigue siendo el último despliegue correcto.
3. Abre el log del build. Un contenido obligatorio vacío (título, descripción o foto de Inicio; título, resumen, foto o texto alternativo de un servicio) detiene el build a propósito. No se sustituye por texto de ejemplo.
4. Corrige el contenido, o revierte el commit, y vuelve a desplegar.
5. Cuando el despliegue figure como listo, abre la URL pública y comprueba el cambio. Hasta entonces no digas que la web está actualizada.

La previsualización del editor, el commit guardado y la web publicada son tres momentos distintos.

## Qué se ha comprobado y qué no

Comprobado en local, sin TinaCloud, el 28 de septiembre de 2026:

- `npm run check` sin errores.
- `npm run build` con `SKIP_CONFIG_GUARD=true` genera la portada, nosotros, contacto, servicios, las seis fichas, gracias y las páginas legales.
- El editor abre con el título 36WEB, en castellano (Guardar, Restablecer, Estás en modo local). El icono de la llama no sale en la cabecera.
- En la previsualización de Inicio, cambiar el título a `Taller Norte` actualizó el titular. No se guardó: el JSON sigue con el texto de ejemplo.
- En Nosotros, cambiar el título a `Estudio Norte` actualizó el titular de `/about`. Se dejó otra vez el texto original y Guardar quedó desactivado.
- La ficha `/services/service-one` muestra marcadores del servicio y del cierre compartido. La cabecera, el pie y el aviso de cookies salen también en las fichas y en las páginas legales.

No hay proyecto TinaCloud ni token. No se ha probado el inicio de sesión, un commit en GitHub, un despliegue real ni el acceso con un usuario Editor. No se ha enviado ningún correo.
