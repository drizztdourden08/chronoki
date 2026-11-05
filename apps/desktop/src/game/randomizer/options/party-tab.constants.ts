/* @layer bridge-wasm @kind constants */
const PARTY_TAB_LABELS = {
  mode: 'Starting party',
  size: 'Size',
  sizeHint: 'The seed picks who. The spoiler shows the party.',
} as const;

const PARTY_MODE_OPTIONS = [
  { value: 'random', label: 'Random' },
  { value: 'custom', label: 'Choose' },
];

const PARTY_SIZE_OPTIONS = [1, 2, 3, 4, 5, 6, 7].map((size) => ({ value: String(size), label: String(size) }));

const PARTY_SECTION = 'Party';

export { PARTY_MODE_OPTIONS, PARTY_SECTION, PARTY_SIZE_OPTIONS, PARTY_TAB_LABELS };
