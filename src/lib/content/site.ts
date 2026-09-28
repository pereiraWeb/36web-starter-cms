import { demoNavigation, type NavItem } from '../../config/navigation';
import { includeDemos } from '../../config/site';
import type { BusinessAddress, BusinessHours, BusinessSocialLinks } from '../../config/business';
import { loadSite } from '../tina/data';
import { toPublicImagePath } from './images';

function required(value: string | null | undefined, label: string): string {
	const text = value?.trim() ?? '';
	if (!text) {
		throw new Error(`Build detenido: falta ${label} en content/site/business.json.`);
	}
	return text;
}

export type SiteDocument = NonNullable<Awaited<ReturnType<typeof loadSite>>['data']['site']>;

export interface SiteNavItem extends NavItem {
	source?: NonNullable<SiteDocument['navigation']>[number];
}

export interface SiteContent {
	document: SiteDocument;
	name: string;
	legalName: string;
	tagline: string;
	description: string;
	email: string;
	phone: string;
	logo: string;
	address: BusinessAddress;
	addressText: string;
	hours: BusinessHours[];
	hoursText: string;
	social: BusinessSocialLinks;
	navigation: SiteNavItem[];
	footer: { linksHeading: string; contactHeading: string; companyHeading: string };
	cookies: {
		title: string;
		message: string;
		acceptAllText: string;
		rejectAllText: string;
		manageText: string;
		policyText: string;
		preferencesTitle: string;
		preferencesDescription: string;
		saveText: string;
	};
}

export async function getSiteContent(): Promise<SiteContent> {
	const result = await loadSite();
	const document = result.data.site;
	if (!document) {
		throw new Error('Build detenido: no existe content/site/business.json.');
	}

	const address: BusinessAddress = {
		street: required(document.address?.street, 'la calle'),
		city: required(document.address?.city, 'la ciudad'),
		region: required(document.address?.region, 'la provincia'),
		postalCode: required(document.address?.postalCode, 'el código postal'),
		country: required(document.address?.country, 'el país'),
	};
	const hours = (document.hours ?? []).flatMap((entry) => {
		const days = entry?.days?.trim() ?? '';
		const span = entry?.hours?.trim() ?? '';
		return days && span ? [{ days, hours: span }] : [];
	});
	if (hours.length === 0) {
		throw new Error('Build detenido: el negocio necesita al menos un horario en content/site/business.json.');
	}

	const navigation: SiteNavItem[] = (document.navigation ?? []).flatMap((item) => {
		const label = item?.label?.trim() ?? '';
		const href = item?.href?.trim() ?? '';
		return label && href ? [{ label, href, source: item }] : [];
	});
	if (navigation.length === 0) {
		throw new Error('Build detenido: el menú del sitio está vacío (content/site/business.json).');
	}
	if (includeDemos) {
		navigation.push({ label: 'Demos', href: '/demos', children: demoNavigation });
	}

	const logo = toPublicImagePath(document.logo);
	if (!logo) {
		throw new Error('Build detenido: falta el logotipo en content/site/business.json.');
	}

	const social = document.social;
	const cookies = document.cookies;

	return {
		document,
		name: required(document.name, 'el nombre'),
		legalName: required(document.legalName, 'la razón social'),
		tagline: required(document.tagline, 'el lema'),
		description: required(document.description, 'la descripción'),
		email: required(document.email, 'el email público'),
		phone: required(document.phone, 'el teléfono'),
		logo,
		address,
		addressText: `${address.street}, ${address.city}, ${address.region} ${address.postalCode}, ${address.country}`,
		hours,
		hoursText: hours.map((entry) => `${entry.days}: ${entry.hours}`).join(' · '),
		social: {
			facebook: social?.facebook?.trim() || undefined,
			instagram: social?.instagram?.trim() || undefined,
			linkedin: social?.linkedin?.trim() || undefined,
			twitter: social?.twitter?.trim() || undefined,
		},
		navigation,
		footer: {
			linksHeading: required(document.footer?.linksHeading, 'el título de enlaces del pie'),
			contactHeading: required(document.footer?.contactHeading, 'el título de contacto del pie'),
			companyHeading: required(document.footer?.companyHeading, 'el título de empresa del pie'),
		},
		cookies: {
			title: required(cookies?.title, 'el título del aviso de cookies'),
			message: required(cookies?.message, 'el texto del aviso de cookies'),
			acceptAllText: required(cookies?.acceptAllText, 'el botón de aceptar cookies'),
			rejectAllText: required(cookies?.rejectAllText, 'el botón de rechazar cookies'),
			manageText: required(cookies?.manageText, 'el botón de configurar cookies'),
			policyText: required(cookies?.policyText, 'el enlace de la política de cookies'),
			preferencesTitle: required(cookies?.preferencesTitle, 'el título de preferencias de cookies'),
			preferencesDescription: required(cookies?.preferencesDescription, 'el texto de preferencias de cookies'),
			saveText: required(cookies?.saveText, 'el botón de guardar cookies'),
		},
	};
}
