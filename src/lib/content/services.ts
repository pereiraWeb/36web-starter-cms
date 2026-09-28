import { type Service } from '../../config/servicesContent';
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
		order: typeof (document as { order?: unknown } | null | undefined)?.order === 'number'
			? (document as { order: number }).order
			: 0,
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

	return items.sort((a, b) => (a.service.order ?? 0) - (b.service.order ?? 0));
}

/**
 * Published services come from `content/services/`. The number in `order`
 * decides the sequence. Demo components that import `services` from config
 * are unchanged.
 */
export async function listPublishedServices(): Promise<Service[]> {
	const editorial = await listEditorialServices();
	return editorial
		.map((item) => item.service)
		.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function getServiceRoutes(): Promise<Array<{ slug: string; editorial: boolean }>> {
	const editorial = await listEditorialServices();
	return editorial.map((item) => ({ slug: item.service.slug, editorial: true }));
}
