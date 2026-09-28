import { legalRoutes } from './navigation';

export type ConsentCategoryId = 'necessary' | 'analytics' | 'marketing';

export interface ConsentCategoryContent {
  id: ConsentCategoryId;
  title: string;
  description: string;
  /** Necessary is always active and can't be turned off by the visitor. */
  required?: boolean;
}

export interface CookieConsentContentConfig {
  /**
   * Bump this (e.g. to `'1.1'`) whenever the cookies used, their purpose, or
   * the categories themselves change materially. A stored consent whose
   * version doesn't match this one is treated as if it didn't exist — see
   * `src/lib/consent.ts` — so visitors are asked again.
   */
  version: string;
  banner: {
    title: string;
    message: string;
    acceptAllText: string;
    rejectAllText: string;
    /** Opens the detailed preferences panel instead of an immediate choice. */
    manageText: string;
    policyText: string;
    policyHref: string;
  };
  preferences: {
    title: string;
    description: string;
    saveText: string;
    acceptAllText: string;
    rejectAllText: string;
    closeLabel: string;
  };
  categories: ConsentCategoryContent[];
}

/** Editable copy for `src/components/ui/CookieConsent.astro`. */
export const cookieConsentContent: CookieConsentContentConfig = {
  version: '1.0',
  banner: {
    title: 'Tu privacidad',
    message:
      'Usamos cookies propias y de terceros para el funcionamiento básico de la web y, solo si lo aceptas, para medir el tráfico y mostrar contenido de servicios externos (mapas, vídeos, anuncios).',
    acceptAllText: 'Aceptar todo',
    rejectAllText: 'Rechazar todo',
    manageText: 'Configurar',
    policyText: 'Más información',
    policyHref: legalRoutes.cookies,
  },
  preferences: {
    title: 'Preferencias de privacidad',
    description:
      'Elige qué categorías de cookies quieres permitir. Puedes cambiar esta decisión cuando quieras desde el enlace "Gestionar cookies" del pie de página.',
    saveText: 'Guardar preferencias',
    acceptAllText: 'Aceptar todo',
    rejectAllText: 'Rechazar todo',
    closeLabel: 'Cerrar',
  },
  categories: [
    {
      id: 'necessary',
      title: 'Necesarias',
      description:
        'Imprescindibles para que la web funcione correctamente: navegación, seguridad del formulario de contacto y recordar tu elección de cookies. No se pueden desactivar.',
      required: true,
    },
    {
      id: 'analytics',
      title: 'Analíticas',
      description:
        'Nos ayudan a entender cómo se usa la web (páginas visitadas, origen del tráfico) para mejorarla. Por ejemplo, Google Analytics.',
    },
    {
      id: 'marketing',
      title: 'Marketing y contenido externo',
      description:
        'Miden la efectividad de nuestros anuncios y permiten mostrar contenido de servicios externos como mapas o vídeos incrustados. Por ejemplo, Google Ads, Meta Pixel, YouTube o Google Maps.',
    },
  ],
};

export interface ConsentGateContent {
  title: string;
  message: string;
  acceptText: string;
}

/**
 * Editable copy for `src/components/ui/ConsentGate.astro` — the placeholder
 * shown instead of a gated embed (map, video...) until the visitor accepts
 * the relevant cookie category.
 */
export const consentGateContent: ConsentGateContent = {
  title: 'Contenido bloqueado',
  message: 'Este contenido lo proporciona un servicio externo que utiliza cookies. Acéptalas para poder verlo.',
  acceptText: 'Aceptar y mostrar',
};
