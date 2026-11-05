/* @layer renderer-components @kind constants */
import type { ArmedAction } from '@app/compounds/ArmedActionButton';
import type { NamedSavesData } from './HomeTab.type';

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

const EMPTY_NAMED_SAVES: NamedSavesData = { list: [], screenshots: {} };

const AUTO_KIND = 'auto';

const AUTO_TRIGGER_LABELS = { timer: 'On timer', quit: 'On quit' } as const;

const NORMAL_KIND = 'normal';

const SESSION_LIST_LIMIT = 20;

const BOOT_WAIT_MS = 120000;

const BOOT_POLL_MS = 100;

const STATUS_LABELS = {
  idle: 'Idle',
  starting: 'Starting...',
  active: 'Active',
  reconnecting: 'Reconnecting...',
  error: 'Error',
} as const;

const NO_SESSION_LABEL = 'Not started';

const CONNECTION_LABELS = { local: 'Local', online: 'Archipelago' } as const;

export { CONNECTION_LABELS, NO_SESSION_LABEL, STATUS_LABELS, ARMED_PROMPTS, AUTO_KIND, AUTO_TRIGGER_LABELS, BOOT_POLL_MS, BOOT_WAIT_MS, EMPTY_NAMED_SAVES, NORMAL_KIND, IMPORT_CONFIRM_WORD, NO_GAME_REASON, SESSION_LIST_LIMIT, SRAM_BYTES, SRAM_EXTENSIONS, TOAST_DURATION_MS };
