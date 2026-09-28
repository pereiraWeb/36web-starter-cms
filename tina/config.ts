import { defineConfig } from 'tinacms';
import { installAdminUi } from './admin-ui';

/**
 * TinaCMS schema. Editorial copy lives in `content/`. Technical settings stay in `src/config/`.
 *
 * Technical settings (canonical domain, form recipient, analytics IDs,
 * design tokens) stay in `src/config/` and are not exposed here.
 * The public email a visitor sees is not the form inbox.
 *
 * `clientId` and `token` stay null until a TinaCloud project exists.
 * `tinacms dev` and `tinacms build --local` read the JSON files in `content/`.
 *
 * This file is excluded from `astro check` (`tsconfig.json`): Tina's collection
 * unions do not satisfy that checker. `tinacms build` validates the schema.
 */
function asText(value: unknown): string {
	return typeof value === 'string' ? value.trim() : '';
}

function limit(value: unknown, max: number, emptyMessage?: string) {
	const text = asText(value);
	if (!text && emptyMessage) return emptyMessage;
	if (text.length > max) return `Usa como máximo ${max} caracteres.`;
}

function stringField(
	name: string,
	label: string,
	description: string,
	options: { required?: boolean; textarea?: boolean; max?: number; title?: boolean } = {},
) {
	const max = options.max ?? 280;
	return {
		type: 'string' as const,
		name,
		label,
		description,
		required: options.required,
		isTitle: options.title,
		ui: {
			...(options.textarea ? { component: 'textarea' } : {}),
			validate: (value: unknown) => limit(value, max, options.required ? 'Este campo es obligatorio.' : undefined),
		},
	};
}

function imageField(name: string, label: string, description: string, required = true) {
	return { type: 'image' as const, name, label, description, required };
}

function group(name: string, label: string, description: string, fields: unknown[]) {
	return { type: 'object' as const, name, label, description, fields };
}

const branch =
	process.env.NEXT_PUBLIC_TINA_BRANCH ||
	process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF ||
	process.env.VERCEL_GIT_COMMIT_REF ||
	process.env.HEAD ||
	'main';

const homeCollection = {
	name: 'home',
	label: 'Inicio',
	path: 'content/pages',
	format: 'json' as const,
	match: { include: 'home' },
	ui: {
		global: true,
		router: () => '/',
	},
	fields: [
		{
			type: 'string' as const,
			name: 'title',
			label: 'Título',
			description: 'Título grande de la portada, encima de la fotografía.',
			required: true,
			isTitle: true,
			ui: {
				validate: (value: unknown) => {
					const text = asText(value);
					if (!text) return 'El título es obligatorio.';
					if (text.length > 80) return 'Usa como máximo 80 caracteres.';
				},
			},
		},
		{
			type: 'string' as const,
			name: 'description',
			label: 'Descripción',
			description: 'Párrafo corto debajo del título de la portada.',
			required: true,
			ui: {
				component: 'textarea',
				validate: (value: unknown) => {
					const text = asText(value);
					if (!text) return 'La descripción es obligatoria.';
					if (text.length > 280) return 'Usa como máximo 280 caracteres.';
				},
			},
		},
		{
			type: 'image' as const,
			name: 'image',
			label: 'Fotografía principal',
			description: 'Foto de fondo de la portada. Se muestra detrás del título.',
			required: true,
		},
		stringField('buttonText', 'Texto del botón', 'Botón de la portada.', { required: true, max: 40 }),
		stringField('buttonHref', 'Enlace del botón', 'Ruta de una página que ya existe, por ejemplo /contacto.', { required: true, max: 80 }),
		stringField('seoTitle', 'Título de la pestaña', 'Texto de la pestaña del navegador, delante del nombre del negocio.', { required: true, max: 60 }),
		stringField('seoDescription', 'Descripción para buscadores', 'Resumen que pueden mostrar Google y las redes.', { textarea: true, required: true, max: 160 }),
		group('story', 'Texto e imagen', 'Bloque que hay justo debajo de la portada.', [
			stringField('eyebrow', 'Antetítulo', 'Etiqueta corta encima del título.', { max: 40 }),
			stringField('title', 'Título', 'Título del bloque.', { required: true, max: 80 }),
			stringField('description', 'Texto', 'Párrafo del bloque.', { textarea: true, required: true, max: 400 }),
			stringField('ctaText', 'Texto del botón', 'Déjalo vacío para ocultar el botón.', { max: 40 }),
			stringField('ctaHref', 'Enlace del botón', 'Ruta de una página que ya existe.', { max: 80 }),
			imageField('image', 'Fotografía', 'Imagen del bloque.'),
			stringField('imageAlt', 'Texto alternativo', 'Describe la foto para quien no puede verla.', { required: true, max: 140 }),
		]),
		stringField('servicesTitle', 'Título de servicios', 'Título encima de las fichas de servicios.', { required: true, max: 80 }),
		stringField('testimonialsTitle', 'Título de opiniones', 'Título encima de las opiniones.', { required: true, max: 80 }),
		group('cta', 'Llamada a la acción', 'Bloque de color al final de la portada.', [
			stringField('eyebrow', 'Antetítulo', 'Etiqueta corta encima del título.', { max: 40 }),
			stringField('title', 'Título', 'Frase principal.', { required: true, max: 80 }),
			stringField('description', 'Texto', 'Párrafo corto.', { textarea: true, max: 280 }),
			stringField('ctaText', 'Botón principal', 'Texto del primer botón.', { required: true, max: 40 }),
			stringField('ctaHref', 'Enlace principal', 'Ruta de una página que ya existe.', { required: true, max: 80 }),
			stringField('secondaryCtaText', 'Segundo botón', 'Déjalo vacío para ocultarlo.', { max: 40 }),
			stringField('secondaryCtaHref', 'Enlace del segundo botón', 'Ruta de una página que ya existe.', { max: 80 }),
		]),
	],
};

const serviceCollection = {
	name: 'service',
	label: 'Servicios',
	path: 'content/services',
	format: 'json' as const,
	ui: {
		router: ({ document }: { document: { _sys: { filename: string } } }) =>
			`/services/${document._sys.filename}`,
		filename: {
			slugify: (values: Record<string, unknown>) => slugify(String(values.title ?? '')),
		},
	},
	defaultItem: () => ({
		title: 'Nuevo servicio',
		description: 'Resumen breve de este servicio.',
		body: 'Explica qué incluye y para quién es.',
		image: '/img/fallback.webp',
		imageAlt: 'Fotografía del servicio',
		features: ['Qué incluye'],
		order: 10,
	}),
	fields: [
		{
			type: 'string' as const,
			name: 'title',
			label: 'Título',
			description: 'Nombre del servicio. Aparece en su página y en la ficha de la portada.',
			required: true,
			isTitle: true,
			ui: {
				validate: (value: unknown) => {
					const text = asText(value);
					if (!text) return 'El título es obligatorio.';
					if (text.length > 80) return 'Usa como máximo 80 caracteres.';
				},
			},
		},
		{
			type: 'string' as const,
			name: 'description',
			label: 'Resumen',
			description: 'Texto breve de la ficha y el primer párrafo de la página del servicio.',
			required: true,
			ui: {
				component: 'textarea',
				validate: (value: unknown) => {
					const text = asText(value);
					if (!text) return 'El resumen es obligatorio.';
					if (text.length > 280) return 'Usa como máximo 280 caracteres.';
				},
			},
		},
		{
			type: 'string' as const,
			name: 'body',
			label: 'Texto',
			description: 'Párrafo más largo, debajo del resumen, solo en la página del servicio.',
			ui: {
				component: 'textarea',
				validate: (value: unknown) => {
					if (asText(value).length > 2000) return 'Usa como máximo 2000 caracteres.';
				},
			},
		},
		{
			type: 'image' as const,
			name: 'image',
			label: 'Fotografía',
			description: 'Foto grande de la página del servicio.',
			required: true,
		},
		{
			type: 'string' as const,
			name: 'imageAlt',
			label: 'Texto alternativo de la foto',
			description: 'Describe la foto para quien no puede verla. No hace falta repetir el título si la imagen ya se entiende con él.',
			required: true,
			ui: {
				validate: (value: unknown) => {
					const text = asText(value);
					if (!text) return 'El texto alternativo es obligatorio.';
					if (text.length > 140) return 'Usa como máximo 140 caracteres.';
				},
			},
		},
		{
			type: 'string' as const,
			name: 'features',
			label: 'Características',
			description: 'Lista de puntos en la página del servicio. Arrastra para cambiar el orden.',
			list: true,
			ui: {
				// Tina passes the whole list here, not one row. Calling trim on the
				// array throws and takes down the visual editor.
				validate: (value: unknown) => {
					const items = Array.isArray(value) ? value : [value];
					const tooLong = items.some(
						(item) => typeof item === 'string' && item.trim().length > 120,
					);
					if (tooLong) return 'Cada punto admite como máximo 120 caracteres.';
				},
			},
		},
		{
			type: 'number' as const,
			name: 'order',
			label: 'Orden',
			description: 'El 1 aparece el primero.',
			required: true,
		},
	],
};

const heroFields = [
	stringField('heroTitle', 'Título', 'Título grande de la cabecera.', { required: true, max: 80 }),
	stringField('heroDescription', 'Descripción', 'Párrafo debajo del título.', { textarea: true, required: true, max: 280 }),
	imageField('heroImage', 'Fotografía', 'Foto de fondo de la cabecera.'),
	stringField('seoTitle', 'Título de la pestaña', 'Texto de la pestaña del navegador.', { required: true, max: 60 }),
	stringField('seoDescription', 'Descripción para buscadores', 'Resumen que pueden mostrar Google y las redes.', {
		textarea: true,
		required: true,
		max: 160,
	}),
];

function pageCollection(
	name: string,
	label: string,
	include: string,
	route: string,
	fields: unknown[],
) {
	return {
		name,
		label,
		path: 'content/pages',
		format: 'json' as const,
		match: { include },
		ui: { global: true, router: () => route },
		fields,
	};
}

const aboutCollection = pageCollection('about', 'Nosotros', 'about', '/about', [
	...heroFields,
	group('story', 'Historia', 'Bloque de texto e imagen.', [
		stringField('eyebrow', 'Antetítulo', 'Etiqueta corta encima del título.', { max: 40 }),
		stringField('title', 'Título', 'Título del bloque.', { required: true, max: 80 }),
		stringField('description', 'Texto', 'Párrafo del bloque.', { textarea: true, required: true, max: 500 }),
		stringField('ctaText', 'Texto del botón', 'Déjalo vacío para ocultar el botón.', { max: 40 }),
		stringField('ctaHref', 'Enlace del botón', 'Ancla o ruta, por ejemplo #equipo.', { max: 80 }),
		imageField('image', 'Fotografía', 'Imagen del bloque.'),
		stringField('imageAlt', 'Texto alternativo', 'Describe la foto para quien no puede verla.', { required: true, max: 140 }),
	]),
	group('text', 'Texto', 'Párrafo sin imagen.', [
		stringField('title', 'Título', 'Título del párrafo.', { required: true, max: 120 }),
		stringField('description', 'Entradilla', 'Frase corta debajo del título.', { textarea: true, max: 280 }),
		stringField('paragraph', 'Párrafo', 'Texto largo.', { textarea: true, required: true, max: 2000 }),
	]),
	stringField('teamTitle', 'Título del equipo', 'Título encima de las personas.', { required: true, max: 80 }),
]);

const contactCollection = pageCollection('contact', 'Contacto', 'contact', '/contact', [
	...heroFields,
	stringField('title', 'Título de los datos', 'Título de la tarjeta con teléfono, correo y dirección.', { required: true, max: 80 }),
	stringField('submitText', 'Texto del botón de envío', 'Botón del formulario.', { required: true, max: 40 }),
	group('thanks', 'Página de gracias', 'Lo que se ve en /thank-you después de enviar el formulario.', [
		stringField('title', 'Título', 'Titular de la página.', { required: true, max: 80 }),
		stringField('description', 'Texto', 'Párrafo de confirmación.', { textarea: true, required: true, max: 280 }),
		stringField('backText', 'Texto del botón', 'Vuelve a la portada.', { required: true, max: 40 }),
		stringField('backHref', 'Enlace del botón', 'Normalmente /.', { required: true, max: 80 }),
	]),
]);

const servicesPageCollection = pageCollection('servicesPage', 'Página de servicios', 'services', '/services', [
	...heroFields,
	stringField('eyebrow', 'Antetítulo', 'Etiqueta encima del listado.', { max: 40 }),
	stringField('title', 'Título del listado', 'Título encima de las fichas.', { required: true, max: 80 }),
	stringField('description', 'Texto del listado', 'Déjalo vacío si no hace falta.', { textarea: true, max: 280 }),
	stringField('ctaText', 'Texto de cada ficha', 'Enlace hacia la página del servicio.', { required: true, max: 40 }),
	stringField('faqTitle', 'Título de las preguntas', 'Título encima de las preguntas frecuentes.', { required: true, max: 80 }),
	group('detailCta', 'Cierre de cada servicio', 'Bloque que aparece al final de la página de un servicio.', [
		stringField('eyebrow', 'Antetítulo', 'Etiqueta corta.', { max: 40 }),
		stringField('title', 'Título', 'Frase principal.', { required: true, max: 80 }),
		stringField('description', 'Texto', 'Párrafo corto.', { textarea: true, max: 280 }),
		stringField('ctaText', 'Botón principal', 'Texto del primer botón.', { required: true, max: 40 }),
		stringField('ctaHref', 'Enlace principal', 'Ruta de una página que ya existe.', { required: true, max: 80 }),
		stringField('secondaryCtaText', 'Segundo botón', 'Déjalo vacío para ocultarlo.', { max: 40 }),
		stringField('secondaryCtaHref', 'Enlace del segundo botón', 'Ruta de una página que ya existe.', { max: 80 }),
	]),
]);

const siteCollection = {
	name: 'site',
	label: 'Datos del negocio',
	path: 'content/site',
	format: 'json' as const,
	ui: { global: true },
	fields: [
		stringField('name', 'Nombre', 'Nombre visible en la cabecera, el pie y la pestaña del navegador.', {
			required: true,
			title: true,
			max: 80,
		}),
		stringField('legalName', 'Razón social', 'Nombre legal, usado en el aviso legal.', { required: true, max: 120 }),
		stringField('tagline', 'Frase breve', 'Una línea debajo del logo en el pie.', { required: true, max: 140 }),
		stringField('description', 'Descripción', 'Resumen del negocio para buscadores cuando una página no tiene el suyo.', {
			textarea: true,
			required: true,
			max: 280,
		}),
		stringField('email', 'Correo visible', 'El que ve el visitante. No es el buzón que recibe el formulario.', {
			required: true,
			max: 120,
		}),
		stringField('phone', 'Teléfono', 'También se usa en el botón de WhatsApp.', { required: true, max: 40 }),
		imageField('logo', 'Logo', 'Marca de la cabecera y el pie. Mejor SVG o WebP pequeño.'),
		group('address', 'Dirección', 'Dirección que se muestra en el contacto y en las páginas legales.', [
			stringField('street', 'Calle y número', 'Calle y número.', { required: true, max: 120 }),
			stringField('city', 'Ciudad', 'Ciudad.', { required: true, max: 80 }),
			stringField('region', 'Provincia', 'Provincia o región.', { required: true, max: 80 }),
			stringField('postalCode', 'Código postal', 'Código postal.', { required: true, max: 16 }),
			stringField('country', 'País', 'País.', { required: true, max: 80 }),
		]),
		{
			type: 'object' as const,
			name: 'hours',
			label: 'Horario',
			description: 'Una fila por tramo. Arrastra para cambiar el orden.',
			list: true,
			fields: [
				stringField('days', 'Días', 'Por ejemplo, Lunes a viernes.', { required: true, max: 60 }),
				stringField('hours', 'Horas', 'Por ejemplo, 9:00 a 18:00.', { required: true, max: 40 }),
			],
		},
		group('social', 'Redes', 'Déjalas vacías para ocultar el icono.', [
			stringField('facebook', 'Facebook', 'URL completa o vacía.', { max: 200 }),
			stringField('instagram', 'Instagram', 'URL completa o vacía.', { max: 200 }),
			stringField('linkedin', 'LinkedIn', 'URL completa o vacía.', { max: 200 }),
			stringField('twitter', 'X / Twitter', 'URL completa o vacía.', { max: 200 }),
		]),
		{
			type: 'object' as const,
			name: 'navigation',
			label: 'Menú',
			description: 'Enlaces de la cabecera y del pie. La ruta tiene que ser una página que ya existe.',
			list: true,
			fields: [
				stringField('label', 'Texto', 'Lo que se lee en el menú.', { required: true, max: 40 }),
				stringField('href', 'Ruta', 'Por ejemplo /servicios. No inventes una ruta nueva.', { required: true, max: 80 }),
			],
		},
		group('footer', 'Pie', 'Títulos de las columnas del pie.', [
			stringField('linksHeading', 'Columna de enlaces', 'Título de los enlaces del menú.', { required: true, max: 40 }),
			stringField('contactHeading', 'Columna de contacto', 'Título de teléfono y correo.', { required: true, max: 40 }),
			stringField('companyHeading', 'Columna de empresa', 'Título de las redes.', { required: true, max: 40 }),
		]),
		group('cookies', 'Aviso de cookies', 'Textos del aviso que aparece al entrar.', [
			stringField('title', 'Título', 'Título del aviso.', { required: true, max: 60 }),
			stringField('message', 'Mensaje', 'Explica para qué se usan las cookies.', { textarea: true, required: true, max: 400 }),
			stringField('acceptAllText', 'Aceptar', 'Botón de aceptar todo.', { required: true, max: 40 }),
			stringField('rejectAllText', 'Rechazar', 'Botón de rechazar.', { required: true, max: 40 }),
			stringField('manageText', 'Configurar', 'Abre las preferencias.', { required: true, max: 40 }),
			stringField('policyText', 'Enlace a la política', 'Texto del enlace.', { required: true, max: 40 }),
			stringField('preferencesTitle', 'Título de preferencias', 'Título del panel de opciones.', { required: true, max: 80 }),
			stringField('preferencesDescription', 'Texto de preferencias', 'Explica que se puede cambiar la decisión.', {
				textarea: true,
				required: true,
				max: 280,
			}),
			stringField('saveText', 'Guardar preferencias', 'Botón de guardar la selección.', { required: true, max: 40 }),
		]),
	],
};

const teamCollection = {
	name: 'team',
	label: 'Equipo',
	path: 'content/team',
	format: 'json' as const,
	ui: {
		router: () => '/about',
		filename: { slugify: (values: Record<string, unknown>) => slugify(String(values.name ?? '')) },
	},
	defaultItem: () => ({
		name: 'Nueva persona',
		role: 'Puesto',
		bio: 'Una frase sobre esta persona.',
		order: 10,
	}),
	fields: [
		stringField('name', 'Nombre', 'Nombre y apellidos.', { required: true, title: true, max: 80 }),
		stringField('role', 'Puesto', 'Cargo en la empresa.', { required: true, max: 80 }),
		stringField('bio', 'Texto', 'Una o dos frases.', { textarea: true, max: 280 }),
		imageField('image', 'Fotografía', 'Retrato. Si lo dejas vacío, se usa la imagen de reserva.', false),
		{
			type: 'number' as const,
			name: 'order',
			label: 'Orden',
			description: 'El 1 aparece el primero.',
			required: true,
		},
	],
};

const testimonialCollection = {
	name: 'testimonial',
	label: 'Opiniones',
	path: 'content/testimonials',
	format: 'json' as const,
	ui: {
		router: () => '/',
		filename: { slugify: (values: Record<string, unknown>) => slugify(String(values.author ?? '')) },
	},
	defaultItem: () => ({
		quote: 'Escribe aquí una opinión real.',
		author: 'Nombre',
		role: 'Cargo, empresa',
		rating: 5,
		order: 10,
	}),
	fields: [
		stringField('quote', 'Opinión', 'Usa solo opiniones reales.', { textarea: true, required: true, title: true, max: 400 }),
		stringField('author', 'Autor', 'Nombre de la persona.', { required: true, max: 80 }),
		stringField('role', 'Cargo', 'Cargo y empresa. Déjalo vacío si no aplica.', { max: 80 }),
		{
			type: 'number' as const,
			name: 'rating',
			label: 'Valoración',
			description: 'De 1 a 5. Déjalo vacío para no mostrar estrellas.',
			ui: {
				validate: (value: unknown) => {
					if (value == null || value === '') return;
					const rating = Number(value);
					if (!Number.isInteger(rating) || rating < 1 || rating > 5) return 'Usa un número del 1 al 5.';
				},
			},
		},
		{
			type: 'number' as const,
			name: 'order',
			label: 'Orden',
			description: 'El 1 aparece el primero.',
			required: true,
		},
	],
};

const faqCollection = {
	name: 'faq',
	label: 'Preguntas',
	path: 'content/faq',
	format: 'json' as const,
	ui: {
		router: () => '/services',
		filename: { slugify: (values: Record<string, unknown>) => slugify(String(values.question ?? '')) },
	},
	defaultItem: () => ({
		question: 'Nueva pregunta',
		answer: 'Respuesta breve.',
		order: 10,
	}),
	fields: [
		stringField('question', 'Pregunta', 'Lo que se lee cerrado.', { required: true, title: true, max: 140 }),
		stringField('answer', 'Respuesta', 'Se muestra al abrir la pregunta.', { textarea: true, required: true, max: 600 }),
		{
			type: 'number' as const,
			name: 'order',
			label: 'Orden',
			description: 'El 1 aparece el primero.',
			required: true,
		},
	],
};

export default defineConfig({
	branch,
	clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || null,
	token: process.env.TINA_TOKEN || null,
	cmsCallback: () => {
		installAdminUi();
	},
	build: {
		outputFolder: 'admin',
		publicFolder: 'public',
	},
	media: {
		tina: {
			publicFolder: 'public',
			mediaRoot: 'uploads',
		},
	},
	schema: {
		collections: [
			siteCollection,
			homeCollection,
			aboutCollection,
			contactCollection,
			servicesPageCollection,
			serviceCollection,
			teamCollection,
			testimonialCollection,
			faqCollection,
		],
	},
});

function slugify(value: string): string {
	const slug = value
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 60);
	return slug || 'servicio';
}
