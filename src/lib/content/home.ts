import type { HomeQuery } from '../../../tina/__generated__/types';
import { toPublicImagePath } from './images';
import { loadHome } from '../tina/data';

export type HomeDocument = HomeQuery['home'];

export interface HomeContent {
	document: HomeDocument;
	title: string;
	description: string;
	image: string;
}

export async function getHomeContent(): Promise<HomeContent> {
	const result = await loadHome();
	const document = result.data.home;
	const title = document?.title?.trim() ?? '';
	const description = document?.description?.trim() ?? '';
	const image = toPublicImagePath(document?.image);

	if (!title || !description || !image) {
		throw new Error(
			'Build detenido: Inicio necesita título, descripción y fotografía principal (content/pages/home.json).',
		);
	}

	return { document, title, description, image };
}
