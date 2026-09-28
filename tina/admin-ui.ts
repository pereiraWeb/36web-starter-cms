/**
 * The Tina admin has no official locale switch. This runs only in the
 * browser, after the admin mounts, and does two things the client sees:
 * the header mark becomes the title "36WEB", and the chrome copy is Spanish.
 * Field values and the site preview live in inputs and an iframe, so they
 * are left alone.
 */
const PHRASES: Record<string, string> = {
	'You are in local mode': 'Estás en modo local',
	'Show editing panel': 'Mostrar el panel',
	'Hide editing panel': 'Ocultar el panel',
	'Open navigation menu': 'Abrir el menú',
	'Toggle navigation menu': 'Abrir el menú',
	Save: 'Guardar',
	Reset: 'Restablecer',
	Cancel: 'Cancelar',
	'Are you sure you want to reset all changes?': '¿Seguro que quieres deshacer los cambios?',
	Collections: 'Contenidos',
	Site: 'Sitio',
	Dashboard: 'Panel',
	'Media Manager': 'Imágenes',
	'Media Usage': 'Uso de imágenes',
	'Log Out': 'Cerrar sesión',
	'Add File': 'Añadir',
	'Add Folder': 'Añadir carpeta',
	'Add Document': 'Añadir',
	'Sort by': 'Ordenar por',
	Default: 'Predeterminado',
	Previous: 'Anterior',
	Next: 'Siguiente',
	Title: 'Título',
	Filename: 'Archivo',
	Extension: 'Extensión',
	Template: 'Plantilla',
	Search: 'Buscar',
	'Search...': 'Buscar…',
	'Search media library': 'Buscar imágenes',
	Edit: 'Editar',
	Delete: 'Borrar',
	Rename: 'Renombrar',
	Duplicate: 'Duplicar',
	Create: 'Crear',
	'Create New': 'Crear',
	'Create Folder': 'Crear carpeta',
	'Enter the name of the new folder': 'Nombre de la carpeta',
	'Drag and drop assets here': 'Arrastra las imágenes aquí',
	'No media files found.': 'No hay imágenes.',
	'No matches found': 'No hay resultados',
	'Read the docs': 'Ver la documentación',
	'📖 Visual Editing Docs': '📖 Cómo se edita',
	'Visual Editing Docs': 'Cómo se edita',
	'TinaCMS form fields will appear here.': 'Los campos aparecerán aquí.',
	'TinaCMS form fields': 'Los campos',
	'will appear here.': 'aparecerán aquí.',
	'You have not configured search.': 'La búsqueda no está configurada.',
	'When you save, changes will be saved to the local filesystem.':
		'Al guardar, los cambios se escriben en los archivos del proyecto.',
	'Welcome to Tina!': 'Bienvenido a 36WEB',
	'Let’s get you editing with TinaCMS!': 'Empieza a editar con 36WEB',
	"Let's get you editing with TinaCMS!": 'Empieza a editar con 36WEB',
	'Log in': 'Entrar',
	'Loading...': 'Cargando…',
	'Loading Dashboard': 'Cargando el panel',
	'Please wait...': 'Espera un momento…',
	'This is your dashboard for editing or creating content. Select a collection on the left to begin.':
		'Desde aquí se edita el contenido. Elige un apartado a la izquierda.',
	'There are no items': 'No hay elementos',
	'Document updated!': 'Cambios guardados',
	'Document created!': 'Documento creado',
	'Document was successfully deleted': 'Documento borrado',
	'There was a problem saving your document': 'No se pudieron guardar los cambios',
	'There was a problem saving your document.': 'No se pudieron guardar los cambios.',
	'Copied to clipboard!': 'Copiado',
	'Enter Edit Mode': 'Editar',
	'Edit in Admin': 'Editar',
	'Preview site in new tab': 'Abrir la web en otra pestaña',
	'Currently editing': 'Editando',
	'File too large': 'El archivo es demasiado grande',
	'Invalid file type': 'Ese tipo de archivo no está permitido',
	'Hang tight, TinaCMS is looking for llamas 🦙 🦙 🦙': 'Cargando el editor…',
	'Untangling markdown with llama teeth 🦙': 'Cargando el editor…',
	'Saddling up the content layer 🦙': 'Cargando el editor…',
	'Counting llamas in your content folder 🦙': 'Cargando el contenido…',
	'Herding llamas into collections 🦙': 'Cargando el contenido…',
	'Alphabetising llamas by collection 🦙': 'Cargando el contenido…',
	'Asking a llama what changed in git 🦙': 'Cargando el contenido…',
	'Brushing llama fur 🦙 🦙': 'Cargando el editor…',
	'Feeding the GraphQL llama 🦙': 'Cargando el editor…',
	'Convincing a llama that MDX is fine 🦙': 'Cargando el editor…',
	'Llamas are proofreading your schema 🦙': 'Cargando el editor…',
	'One more llama, almost there 🦙': 'Casi está…',
	'Polishing the sidebar, llama style 🦙': 'Cargando el editor…',
	'Reticulating llama splines 🦙': 'Cargando el editor…',
	'Teaching a llama to write frontmatter 🦙': 'Cargando el editor…',
	'Waking the llamas in the media library 🦙': 'Cargando las imágenes…',
	'Filter...': 'Filtrar…',
	'Filter by media type': 'Filtrar por tipo',
	'In Use': 'En uso',
	Unused: 'Sin usar',
	'Grid view': 'Cuadrícula',
	'List view': 'Lista',
	Upload: 'Subir',
	'Upload ': 'Subir',
	Insert: 'Insertar',
	Close: 'Cerrar',
	Confirm: 'Confirmar',
	Yes: 'Sí',
	Required: 'Obligatorio',
	'Last Updated': 'Última actualización',
	'Open Git Pull Request': 'Abrir la solicitud de cambios',
	'Save draft': 'Guardar borrador',
	'Save and publish': 'Guardar y publicar',
	'Branch List': 'Ramas',
	'Select Branch': 'Elegir rama',
	'Create Branch': 'Crear rama',
	'Branch Name': 'Nombre de la rama',
	'Referenced Files': 'Archivos relacionados',
};

const SKIP_SELECTOR = 'iframe, input, textarea, select, script, style, [data-brand="36web"]';

function translate(value: string): string {
	const match = value.match(/^(\s*)([\s\S]*?)(\s*)$/);
	if (!match) return value;
	const core = match[2];
	if (!core) return value;

	let next = PHRASES[core];
	if (!next && core.startsWith('Back to ')) next = `Volver a ${core.slice('Back to '.length)}`;
	if (!next) {
		const sorted = core
			.replace(/ \(Ascending\)$/, ' (ascendente)')
			.replace(/ \(Descending\)$/, ' (descendente)');
		if (sorted === core) return value;
		next = sorted;
	}
	return `${match[1]}${next}${match[3]}`;
}

function translateTree(node: Node) {
	if (node.nodeType === Node.TEXT_NODE) {
		const current = node.nodeValue ?? '';
		const next = translate(current);
		if (next !== current) node.nodeValue = next;
		return;
	}
	if (!(node instanceof Element) || node.matches(SKIP_SELECTOR)) return;

	for (const attr of ['title', 'aria-label', 'placeholder']) {
		const current = node.getAttribute(attr);
		if (!current) continue;
		const next = translate(current);
		if (next !== current) node.setAttribute(attr, next);
	}

	for (const child of node.childNodes) translateTree(child);
}

function replaceLogo(svg: SVGElement) {
	if (svg.dataset.brandChecked === '1') return;
	const label = document.createElement('span');
	label.dataset.brand = '36web';
	label.textContent = '36WEB';
	label.className = 'self-center text-lg font-semibold tracking-tight text-gray-900 mr-2';
	svg.replaceWith(label);
}

function brandHeader() {
	document.querySelectorAll('svg').forEach((svg) => {
		const cls = svg.getAttribute('class') ?? '';
		const isHeader = cls.includes('h-10') && cls.includes('text-orange-500');
		const isModal = cls.includes('fill-tina-orange');
		if (isHeader || isModal) replaceLogo(svg);
	});
	if (document.title !== '36WEB') document.title = '36WEB';
	document.documentElement.lang = 'es';
}

export function installAdminUi() {
	if (typeof document === 'undefined') return;

	const apply = () => {
		brandHeader();
		translateTree(document.body);
	};

	apply();
	const observer = new MutationObserver(apply);
	observer.observe(document.body, {
		subtree: true,
		childList: true,
		characterData: true,
		attributes: true,
		attributeFilter: ['title', 'aria-label', 'placeholder', 'class'],
	});
}
