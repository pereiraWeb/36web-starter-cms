export interface LegalTemplateNoticeContent {
  title: string;
  message: string;
}

/** Editable copy for `src/components/ui/LegalTemplateNotice.astro`, shown at the top of every page in `src/pages/legal/`. */
export const legalTemplateNotice: LegalTemplateNoticeContent = {
  title: 'Plantilla incompleta: sustitúyela antes de publicar',
  message:
    'El texto de esta página es un punto de partida genérico, no un documento legal válido. Reemplaza todos los campos entre corchetes por los datos reales de tu empresa y pide a un profesional (abogado o gestoría) que revise el contenido final antes de publicar la web.',
};

export interface LegalPagesContentConfig {
  /**
   * ISO date (`YYYY-MM-DD`) shown as "last updated" on every legal page.
   * Update it every time you materially edit the legal content.
   */
  lastUpdated: string;
}

export const legalPagesContent: LegalPagesContentConfig = {
  lastUpdated: '2026-07-28',
};
