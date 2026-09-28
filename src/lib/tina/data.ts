import { requestWithMetadata } from '@tinacms/astro';
import client from '../../../tina/__generated__/client';
import type { HomeQuery, ServiceConnectionQuery, ServiceQuery } from '../../../tina/__generated__/types';

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
	return raw.data.serviceConnection.edges ?? [];
}
