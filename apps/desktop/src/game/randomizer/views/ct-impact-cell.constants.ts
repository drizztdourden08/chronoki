/* @layer bridge-wasm @kind constants */
const NOTE_LABEL: Readonly<Record<string, string>> = {
  'n/a': 'not used',
  '0 shuffled': 'not shuffled',
};

const PENDING_CELL = { text: 'reading the pack', muted: true };

export { NOTE_LABEL, PENDING_CELL };
