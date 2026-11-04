/* @layer renderer-components @kind constants */
import { CT_QUICK_SLOTS } from '@chronoki/game-core';
import type { ArmedAction } from '@app/compounds/ArmedActionButton';

const QUICK_SAVE_SLOTS = CT_QUICK_SLOTS;

const NO_GAME_REASON = 'Start the game to save';

const ARMED_PROMPTS: Readonly<Record<ArmedAction, string>> = {
  load: 'Click again to load',
  save: 'Click again to overwrite',
  delete: 'Click again to delete',
};

const SRAM_BYTES = 8192;

const SRAM_EXTENSIONS = ['srm', 'sav', 'dat'];

const IMPORT_CONFIRM_WORD = 'import';

const TOAST_DURATION_MS = 4000;

const MODE_LABELS = { original: 'Original', modified: 'Enhanced' } as const;

export { ARMED_PROMPTS, IMPORT_CONFIRM_WORD, MODE_LABELS, NO_GAME_REASON, QUICK_SAVE_SLOTS, SRAM_BYTES, SRAM_EXTENSIONS, TOAST_DURATION_MS };
