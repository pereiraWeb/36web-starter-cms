import { defineConfig } from 'tinacms';

/**
 * TinaCMS schema for the editorial pilot.
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
	],
};

export default defineConfig({
	branch,
	clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || null,
	token: process.env.TINA_TOKEN || null,
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
		collections: [homeCollection, serviceCollection],
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
