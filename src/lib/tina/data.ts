import { requestWithMetadata } from '@tinacms/astro';
import client from '../../../tina/__generated__/client';
import type { AboutQuery, ContactQuery, HomeQuery, ServiceConnectionQuery, ServiceQuery, ServicesPageQuery, SiteQuery } from '../../../tina/__generated__/types';

const HOME_PATH = 'home.json';

function cmsReadError(what: string, error: unknown): Error {
	const reason = error instanceof Error ? error.message : String(error);
	return new Error(
		`No se pudo leer ${what}. El build local tiene que arrancar el índice de Tina (` +
			'`tinacms build --local --skip-cloud-checks -c "astro build"`). ' +
			`En producción hace falta \`npm run build:cloud\` con NEXT_PUBLIC_TINA_CLIENT_ID y TINA_TOKEN. ` +
			`Detalle: ${reason}`,
	);
}

export async function loadHome() {
	let raw: { data: HomeQuery; query: string; variables: Record<string, unknown> };
	try {
		raw = await client.queries.home({ relativePath: HOME_PATH });
	} catch (error) {
		throw cmsReadError('el contenido de Inicio (content/pages/home.json)', error);
	}

	if (!raw?.data?.home) {
		throw new Error(
			'Build detenido: no existe content/pages/home.json. El sitio no se publica con un texto de ejemplo inventado.',
		);
	}

	return requestWithMetadata(raw, { priority: 'primary' });
}

export async function loadService(slug: string) {
	const relativePath = `${slug}.json`;
	let raw: { data: ServiceQuery; query: string; variables: Record<string, unknown> };
	try {
		raw = await client.queries.service({ relativePath });
	} catch (error) {
		throw cmsReadError(`el servicio "${slug}" (content/services/${relativePath})`, error);
	}

	if (!raw?.data?.service) {
		throw new Error(
			`Build detenido: no existe content/services/${relativePath}. El sitio no publica una ficha de ejemplo en su lugar.`,
		);
	}

	return requestWithMetadata(raw, { priority: 'primary' });
}

export async function loadServiceList() {
	let raw: { data: ServiceConnectionQuery; query: string; variables: Record<string, unknown> };
	try {
		raw = await client.queries.serviceConnection();
	} catch (error) {
		throw cmsReadError('el listado de servicios (content/services/)', error);
	}
	const enriched = await requestWithMetadata(raw);
	return enriched.data.serviceConnection.edges ?? [];
}

type TinaResult<TData> = { data: TData; query: string; variables: Record<string, unknown> };

async function readDocument<TData>(
	what: string,
	load: () => Promise<TinaResult<TData>>,
	present: (data: TData) => unknown,
	priority?: 'primary',
) {
	let raw: TinaResult<TData>;
	try {
		raw = await load();
	} catch (error) {
		throw cmsReadError(what, error);
	}
	if (!present(raw.data)) {
		throw new Error(`Build detenido: no existe ${what}.`);
	}
	return requestWithMetadata(raw, priority ? { priority } : undefined);
}

export function loadSite() {
	return readDocument(
		'los datos del negocio (content/site/business.json)',
		() => client.queries.site({ relativePath: 'business.json' }),
		(data: SiteQuery) => data.site,
	);
}

export function loadAbout() {
	return readDocument(
		'la página Nosotros (content/pages/about.json)',
		() => client.queries.about({ relativePath: 'about.json' }),
		(data: AboutQuery) => data.about,
		'primary',
	);
}

export function loadContact() {
	return readDocument(
		'la página Contacto (content/pages/contact.json)',
		() => client.queries.contact({ relativePath: 'contact.json' }),
		(data: ContactQuery) => data.contact,
		'primary',
	);
}

export function loadServicesPage(priority?: 'primary') {
	return readDocument(
		'la página de servicios (content/pages/services.json)',
		() => client.queries.servicesPage({ relativePath: 'services.json' }),
		(data: ServicesPageQuery) => data.servicesPage,
		priority,
	);
}

function readOrder(value: unknown): number {
	return typeof value === 'number' ? value : 0;
}

function sortByOrder<T>(items: T[]): T[] {
	return [...items].sort(
		(a, b) => readOrder((a as { order?: unknown }).order) - readOrder((b as { order?: unknown }).order),
	);
}

export async function loadTeamList() {
	try {
		const raw = await requestWithMetadata(await client.queries.teamConnection());
		const nodes = (raw.data.teamConnection.edges ?? []).flatMap((edge) => (edge?.node ? [edge.node] : []));
		return sortByOrder(nodes);
	} catch (error) {
		throw cmsReadError('el equipo (content/team/)', error);
	}
}

export async function loadTestimonialList() {
	try {
		const raw = await requestWithMetadata(await client.queries.testimonialConnection());
		const nodes = (raw.data.testimonialConnection.edges ?? []).flatMap((edge) => (edge?.node ? [edge.node] : []));
		return sortByOrder(nodes);
	} catch (error) {
		throw cmsReadError('las opiniones (content/testimonials/)', error);
	}
}

export async function loadFaqList() {
	try {
		const raw = await requestWithMetadata(await client.queries.faqConnection());
		const nodes = (raw.data.faqConnection.edges ?? []).flatMap((edge) => (edge?.node ? [edge.node] : []));
		return sortByOrder(nodes);
	} catch (error) {
		throw cmsReadError('las preguntas (content/faq/)', error);
	}
}
