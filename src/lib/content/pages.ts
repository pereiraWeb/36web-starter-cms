import { loadAbout, loadContact, loadFaqList, loadServicesPage, loadTeamList, loadTestimonialList } from '../tina/data';
import { getHomeContent } from './home';
import { getEditorialService, listEditorialServices, type EditorialService } from './services';
import { getSiteContent, type SiteContent } from './site';
import { toPublicImagePath } from './images';

function required(value: string | null | undefined, label: string): string {
	const text = value?.trim() ?? '';
	if (!text) throw new Error(`Build detenido: falta ${label}.`);
	return text;
}

export async function getHomePage() {
	const home = await getHomeContent();
	const document = home.document;
	if (!document) {
		throw new Error('Build detenido: no existe content/pages/home.json.');
	}
	const story = document.story;
	const cta = document.cta;
	required(document.buttonText, 'el botón de la portada (content/pages/home.json)');
	required(document.buttonHref, 'el enlace del botón de la portada (content/pages/home.json)');
	required(document.seoTitle, 'el título SEO de Inicio');
	required(document.seoDescription, 'la descripción SEO de Inicio');
	required(document.servicesTitle, 'el título de servicios en Inicio');
	required(document.testimonialsTitle, 'el título de opiniones en Inicio');
	required(story?.title, 'el título de la historia de Inicio');
	required(story?.description, 'el texto de la historia de Inicio');
	required(story?.imageAlt, 'el texto alternativo de la historia de Inicio');
	if (!toPublicImagePath(story?.image)) {
		throw new Error('Build detenido: falta la fotografía de la historia de Inicio.');
	}
	required(cta?.title, 'el título del cierre de Inicio');
	required(cta?.ctaText, 'el botón del cierre de Inicio');
	required(cta?.ctaHref, 'el enlace del cierre de Inicio');

	const services = await listEditorialServices();
	const testimonials = await loadTestimonialList();
	for (const item of testimonials) {
		required(item.quote, 'una opinión');
		required(item.author, 'el autor de una opinión');
	}

	return { document, services, testimonials };
}

export async function getAboutPage() {
	const result = await loadAbout();
	const document = result.data.about;
	if (!document) throw new Error('Build detenido: no existe content/pages/about.json.');
	required(document.heroTitle, 'el título de Nosotros');
	required(document.heroDescription, 'el texto de Nosotros');
	required(document.seoTitle, 'el título SEO de Nosotros');
	required(document.seoDescription, 'la descripción SEO de Nosotros');
	if (!toPublicImagePath(document.heroImage)) {
		throw new Error('Build detenido: falta la fotografía de Nosotros.');
	}
	const story = document.story;
	const text = document.text;
	required(story?.title, 'el título de la historia de Nosotros');
	required(story?.description, 'el texto de la historia de Nosotros');
	required(story?.imageAlt, 'el texto alternativo de la historia de Nosotros');
	if (!toPublicImagePath(story?.image)) {
		throw new Error('Build detenido: falta la fotografía de la historia de Nosotros.');
	}
	required(text?.title, 'el título del texto de Nosotros');
	required(text?.paragraph, 'el párrafo de Nosotros');
	required(document.teamTitle, 'el título del equipo');

	const team = await loadTeamList();
	for (const member of team) {
		required(member.name, 'el nombre de un miembro del equipo');
		required(member.role, 'el cargo de un miembro del equipo');
	}
	return { document, team };
}

export async function getContactPage() {
	const result = await loadContact();
	const document = result.data.contact;
	if (!document) throw new Error('Build detenido: no existe content/pages/contact.json.');
	required(document.heroTitle, 'el título de Contacto');
	required(document.heroDescription, 'el texto de Contacto');
	required(document.seoTitle, 'el título SEO de Contacto');
	required(document.seoDescription, 'la descripción SEO de Contacto');
	required(document.title, 'el título de la ficha de contacto');
	required(document.submitText, 'el botón de envío');
	if (!toPublicImagePath(document.heroImage)) {
		throw new Error('Build detenido: falta la fotografía de Contacto.');
	}
	const thanks = document.thanks;
	required(thanks?.title, 'el título de la página de gracias');
	required(thanks?.description, 'el texto de la página de gracias');
	required(thanks?.backText, 'el botón de volver');
	required(thanks?.backHref, 'el enlace de volver');
	const site = await getSiteContent();
	return { document, site };
}

export async function getServicesIndex() {
	const result = await loadServicesPage('primary');
	const document = result.data.servicesPage;
	if (!document) throw new Error('Build detenido: no existe content/pages/services.json.');
	required(document.heroTitle, 'el título de Servicios');
	required(document.heroDescription, 'el texto de Servicios');
	required(document.seoTitle, 'el título SEO de Servicios');
	required(document.seoDescription, 'la descripción SEO de Servicios');
	required(document.title, 'el título del listado de servicios');
	required(document.ctaText, 'el texto de la ficha de servicio');
	required(document.faqTitle, 'el título de las preguntas');
	if (!toPublicImagePath(document.heroImage)) {
		throw new Error('Build detenido: falta la fotografía de Servicios.');
	}
	const services = await listEditorialServices();
	const faqs = await loadFaqList();
	for (const item of faqs) {
		required(item.question, 'una pregunta');
		required(item.answer, 'una respuesta');
	}
	return { document, services, faqs };
}

export async function getServicePage(slug: string) {
	const editorial = await getEditorialService(slug);
	const result = await loadServicesPage();
	const servicesPage = result.data.servicesPage;
	const cta = servicesPage?.detailCta;
	required(cta?.title, 'el título del cierre de la ficha de servicio');
	required(cta?.ctaText, 'el botón del cierre de la ficha de servicio');
	required(cta?.ctaHref, 'el enlace del cierre de la ficha de servicio');
	return { editorial, servicesPage: servicesPage! };
}

export type HomePageData = Awaited<ReturnType<typeof getHomePage>>;
export type AboutPageData = Awaited<ReturnType<typeof getAboutPage>>;
export type ContactPageData = Awaited<ReturnType<typeof getContactPage>>;
export type ServicesIndexData = Awaited<ReturnType<typeof getServicesIndex>>;
export type ServicePageData = Awaited<ReturnType<typeof getServicePage>>;
export type { EditorialService, SiteContent };
