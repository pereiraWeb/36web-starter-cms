import { services as configServices, type Service } from '../../config/servicesContent';
import type { ServiceQuery } from '../../../tina/__generated__/types';
import { toPublicImagePath } from './images';
import { loadService, loadServiceList } from '../tina/data';

export type ServiceDocument = ServiceQuery['service'];

export interface EditorialService {
	service: Service;
	document: ServiceDocument;
}

function toService(slug: string, document: ServiceDocument | null | undefined): Service | null {
	const title = document?.title?.trim() ?? '';
	const description = document?.description?.trim() ?? '';
	const image = toPublicImagePath(document?.image);
	const imageAlt = document?.imageAlt?.trim() ?? '';
	if (!title || !description || !image || !imageAlt) return null;

	const features = (document?.features ?? []).filter((feature): feature is string => Boolean(feature?.trim()));
	const body = document?.body?.trim() ?? '';

	return {
		slug,
		title,
		description,
		content: body || undefined,
		image,
		imageAlt,
		features,
	};
}

function incomplete(slug: string): Error {
	return new Error(
		`Build detenido: el servicio "${slug}" necesita título, resumen, fotografía y texto alternativo (content/services/${slug}.json).`,
	);
}

export async function getEditorialService(slug: string): Promise<EditorialService> {
	const result = await loadService(slug);
	const document = result.data.service;
	const service = toService(slug, document);
	if (!service || !document) throw incomplete(slug);
	return { service, document };
}

export async function listEditorialServices(): Promise<EditorialService[]> {
	const edges = await loadServiceList();
	const items: EditorialService[] = [];

	for (const edge of edges) {
		const document = edge?.node;
		if (!document) continue;
		const slug = document._sys.filename;
		const service = toService(slug, document);
		if (!service) throw incomplete(slug);
		items.push({ service, document });
	}

	return items;
}

/**
 * Published service list: editorial JSON replaces a config entry with the
 * same slug, and new editorial files are appended. Demo components that
 * import `services` directly are unchanged.
 */
export async function listPublishedServices(): Promise<Service[]> {
	const editorial = await listEditorialServices();
	const bySlug = new Map(editorial.map((item) => [item.service.slug, item.service]));
	const configSlugs = new Set(configServices.map((service) => service.slug));

	return [
		...configServices.map((service) => bySlug.get(service.slug) ?? service),
		...editorial.map((item) => item.service).filter((service) => !configSlugs.has(service.slug)),
	];
}

export async function getServiceRoutes(): Promise<Array<{ slug: string; editorial: boolean }>> {
	const published = await listPublishedServices();
	const editorialSlugs = new Set((await listEditorialServices()).map((item) => item.service.slug));
	return published.map((service) => ({
		slug: service.slug,
		editorial: editorialSlugs.has(service.slug),
	}));
}
