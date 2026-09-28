export interface ContactFieldLabels {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export const contactFieldLabels: ContactFieldLabels = {
  name: 'Nombre',
  email: 'Correo electrónico',
  phone: 'Teléfono',
  message: 'Mensaje',
};

export interface ContactContentConfig {
  split: {
    title: string;
    submitText: string;
    emailLabel: string;
    phoneLabel: string;
    addressLabel: string;
    hoursLabel: string;
  };
  centered: { eyebrow?: string; title: string; description?: string; submitText: string };
  cards: {
    eyebrow?: string;
    title: string;
    description?: string;
    submitText: string;
    phoneLabel: string;
    emailLabel: string;
    addressLabel: string;
  };
  minimal: { title: string; description?: string; submitText: string };
  stacked: {
    eyebrow?: string;
    title: string;
    description?: string;
    submitText: string;
    phoneLabel: string;
    emailLabel: string;
    addressLabel: string;
  };
}

/**
 * Editable copy for every component in `src/components/contact/`.
 * Field labels above are shared across all variants.
 */
export const contactContent: ContactContentConfig = {
  split: {
    title: 'Contact',
    submitText: 'Enviar',
    emailLabel: 'Email',
    phoneLabel: 'Teléfono',
    addressLabel: 'Dirección',
    hoursLabel: 'Horario',
  },
  centered: {
    eyebrow: 'Get in touch',
    title: "Let's talk about your project",
    description: 'Fill in the form below and we will get back to you as soon as possible.',
    submitText: 'Enviar mensaje',
  },
  cards: {
    eyebrow: 'Contact',
    title: 'We would love to hear from you',
    description: 'Reach out directly or send us a message using the form.',
    submitText: 'Enviar',
    phoneLabel: 'Phone',
    emailLabel: 'Email',
    addressLabel: 'Address',
  },
  minimal: {
    title: 'Get in touch',
    description: 'Send us a message and we will reply within one business day.',
    submitText: 'Enviar',
  },
  stacked: {
    eyebrow: 'Contact',
    title: 'Get in touch with us',
    description: 'Choose whatever works best for you, or fill in the form below.',
    submitText: 'Enviar mensaje',
    phoneLabel: 'Call us',
    emailLabel: 'Email us',
    addressLabel: 'Visit us',
  },
};
