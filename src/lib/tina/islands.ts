import type { IslandRegistry } from '@tinacms/astro/experimental';
import HomeHero from '../../components/tina/HomeHero.astro';
import ServiceArticle from '../../components/tina/ServiceArticle.astro';
import { getHomeContent } from '../content/home';
import { getEditorialService } from '../content/services';

const PLAIN = { tag: 'div' };

export const islands: IslandRegistry = {
	home: {
		fetch: () => getHomeContent(),
		component: HomeHero,
		wrapper: PLAIN,
		propsFromData: (data) => ({
			data: (data as Awaited<ReturnType<typeof getHomeContent>>).document,
		}),
	},
	service: {
		fetch: (_request, params) => getEditorialService(params.get('slug') ?? ''),
		component: ServiceArticle,
		wrapper: PLAIN,
		propsFromData: (data) => {
			const editorial = data as Awaited<ReturnType<typeof getEditorialService>>;
			return { service: editorial.service, source: editorial.document };
		},
	},
};
