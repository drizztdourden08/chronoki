/* @layer renderer-components @kind constants */
import { CT_QUICK_SLOTS } from '@chronoki/game-core';
import type { ArmedAction } from '@app/compounds/ArmedActionButton';
import type { NamedSavesData } from './HomeTab.type';

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

const DATA_URL_CHUNK = 0x8000;

const EMPTY_NAMED_SAVES: NamedSavesData = { list: [], screenshots: {} };

const AUTO_KIND = 'auto';

const AUTO_TRIGGER_LABELS = { timer: 'On timer', quit: 'On quit' } as const;

const NORMAL_KIND = 'normal';

const SESSION_LIST_LIMIT = 20;

const BOOT_WAIT_MS = 120000;

const BOOT_POLL_MS = 100;

const MODE_LABELS = { original: 'Original', modified: 'Enhanced' } as const;

export { ARMED_PROMPTS, AUTO_KIND, AUTO_TRIGGER_LABELS, BOOT_POLL_MS, BOOT_WAIT_MS, DATA_URL_CHUNK, EMPTY_NAMED_SAVES, NORMAL_KIND, IMPORT_CONFIRM_WORD, MODE_LABELS, NO_GAME_REASON, QUICK_SAVE_SLOTS, SESSION_LIST_LIMIT, SRAM_BYTES, SRAM_EXTENSIONS, TOAST_DURATION_MS };
