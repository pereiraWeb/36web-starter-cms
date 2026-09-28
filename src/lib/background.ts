export interface BackgroundProps {
  /** Any valid CSS color (e.g. "#0f172a", "var(--color-primary)", "rebeccapurple"). */
  backgroundColor?: string;
  /** Background image URL. Rendered with cover/center sizing. */
  backgroundImage?: string;
}

/**
 * Builds an inline `style` string that applies an optional background color
 * and/or background image, plus any extra CSS declarations (e.g. custom
 * properties already used by a component). Used by every section-level
 * component so background can always be overridden via props.
 */
export function backgroundStyle(
  { backgroundColor, backgroundImage }: BackgroundProps,
  extra: Record<string, string | undefined> = {},
): string | undefined {
  const declarations: string[] = [];

  for (const [property, value] of Object.entries(extra)) {
    if (value !== undefined) {
      declarations.push(`${property}: ${value};`);
    }
  }

  if (backgroundColor) {
    declarations.push(`background-color: ${backgroundColor};`);
  }

  if (backgroundImage) {
    declarations.push(`background-image: url(${backgroundImage});`, 'background-size: cover;', 'background-position: center;');
  }

  return declarations.length > 0 ? declarations.join(' ') : undefined;
}
