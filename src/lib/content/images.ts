/** Turns a Tina image value into a public URL and rejects active content URLs. */
export function toPublicImagePath(value: unknown): string | undefined {
	const raw = typeof value === 'string' ? value.trim() : '';
	if (!raw) return undefined;
	if (/^(javascript|data|vbscript):/i.test(raw)) {
		throw new Error(`La imagen "${raw}" no es una URL permitida.`);
	}
	if (/^https?:\/\//i.test(raw)) return raw;
	return raw.startsWith('/') ? raw : `/${raw}`;
}
