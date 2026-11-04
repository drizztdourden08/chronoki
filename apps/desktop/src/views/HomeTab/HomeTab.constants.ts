/* @layer renderer-components @kind constants */
const SRAM_BYTES = 8192;

const SRAM_EXTENSIONS = ['srm', 'sav', 'dat'];

const IMPORT_CONFIRM_WORD = 'import';

const TOAST_DURATION_MS = 4000;

const MODE_LABELS = { original: 'Original', modified: 'Enhanced' } as const;

export { IMPORT_CONFIRM_WORD, MODE_LABELS, SRAM_BYTES, SRAM_EXTENSIONS, TOAST_DURATION_MS };
