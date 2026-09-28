import type { IslandRegistry } from '@tinacms/astro/experimental';
import HomePage from '../../components/tina/HomePage.astro';
import AboutPage from '../../components/tina/AboutPage.astro';
import ContactPage from '../../components/tina/ContactPage.astro';
import ServicesIndex from '../../components/tina/ServicesIndex.astro';
import ServicePage from '../../components/tina/ServicePage.astro';
import SiteHeader from '../../components/tina/SiteHeader.astro';
import SiteFooter from '../../components/tina/SiteFooter.astro';
import ThankYouPage from '../../components/tina/ThankYouPage.astro';
import { getAboutPage, getContactPage, getHomePage, getServicePage, getServicesIndex } from '../content/pages';
import { getSiteContent } from '../content/site';

const PLAIN = { tag: 'div' };

export const islands: IslandRegistry = {
	'site-header': {
		fetch: () => getSiteContent(),
		component: SiteHeader,
		wrapper: PLAIN,
		propsFromData: (data) => ({ site: data }),
	},
	'site-footer': {
		fetch: () => getSiteContent(),
		component: SiteFooter,
		wrapper: PLAIN,
		propsFromData: (data) => ({ site: data }),
	},
	home: {
		fetch: () => getHomePage(),
		component: HomePage,
		wrapper: PLAIN,
		propsFromData: (data) => ({ data }),
	},
	about: {
		fetch: () => getAboutPage(),
		component: AboutPage,
		wrapper: PLAIN,
		propsFromData: (data) => ({ data }),
	},
	contact: {
		fetch: () => getContactPage(),
		component: ContactPage,
		wrapper: PLAIN,
		propsFromData: (data) => ({ data }),
	},
	services: {
		fetch: () => getServicesIndex(),
		component: ServicesIndex,
		wrapper: PLAIN,
		propsFromData: (data) => ({ data }),
	},
	service: {
		fetch: (_request, params) => getServicePage(params.get('slug') ?? ''),
		component: ServicePage,
		wrapper: PLAIN,
		propsFromData: (data) => ({ data }),
	},
	thanks: {
		fetch: () => getContactPage(),
		component: ThankYouPage,
		wrapper: PLAIN,
		propsFromData: (data) => ({ data }),
	},
};
