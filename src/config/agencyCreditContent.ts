export interface AgencyCreditContent {
  text: string;
  /** Rendered in `--color-primary`, before `linkMiddle` (e.g. a terminal-style prompt symbol). */
  linkPrefix: string;
  /** Rendered in the footer's regular muted text color. */
  linkMiddle: string;
  /** Rendered in `--color-primary`, after `linkMiddle` (e.g. the TLD plus a blinking-cursor style underscore). */
  linkSuffix: string;
  href: string;
}

/**
 * Editable copy for `src/components/ui/AgencyCredit.astro`, the small
 * attribution line shown in every footer variant. The link is rendered as
 * `linkPrefix + linkMiddle + linkSuffix` (e.g. ">pereiraweb.es_").
 */
export const agencyCreditContent: AgencyCreditContent = {
  text: 'Página creada con el plan WEB 360 de',
  linkPrefix: '>',
  linkMiddle: 'pereiraweb',
  linkSuffix: '.es_',
  href: 'https://pereiraweb.es/web-profesional-360',
};
