export interface TextBlockContent {
  title: string;
  /** Optional short text shown right below the title. Set to an empty string (or omit the prop) to skip it. */
  description?: string;
  paragraph: string;
}

/**
 * Editable copy for `src/components/text/TextBlock.astro`. Replace this
 * placeholder lorem ipsum with real content before publishing.
 */
export const textBlockContent: TextBlockContent = {
  title: 'Lorem ipsum dolor sit amet',
  description: 'Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  paragraph:
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat. Cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
};
