/**
 * Swaps any `<img data-fallback-src="...">` to that fallback URL if it fails
 * to load (wrong path, deleted file, corrupt upload...), so visitors see a
 * real placeholder image instead of the browser's broken-image icon. Set by
 * `ResponsiveImage.astro` and `BrandMark.astro` on every image that has one.
 *
 * A single delegated listener on `document` rather than one per `<img>`:
 * cheaper, and it also catches images swapped in later by client-side
 * scripts. `error` events on `<img>` don't bubble, so this only works
 * because it's registered for the *capturing* phase (`true`), which capture
 * listeners still receive even for non-bubbling events.
 */
export function initImageFallbacks(): void {
	document.addEventListener(
		'error',
		(event) => {
			const target = event.target;
			if (!(target instanceof HTMLImageElement)) return;

			const fallback = target.dataset.fallbackSrc;
			if (!fallback || target.src === fallback) return;

			// Avoid an infinite loop if the fallback itself 404s.
			delete target.dataset.fallbackSrc;
			target.src = fallback;
		},
		true,
	);
}
