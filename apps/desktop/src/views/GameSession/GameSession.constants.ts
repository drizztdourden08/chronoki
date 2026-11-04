/* @layer renderer-appshell @kind constants */
import type { FunctionAction } from '@chronoki/input-mapping';

const FUNCTION_ACTION_GATES: Partial<Record<FunctionAction, string>> = {
  'save-state': 'saveStates',
  'load-state': 'saveStates',
  'slot-next': 'saveStates',
  'slot-prev': 'saveStates',
  'fast-forward': 'turbo',
};

const DEVELOPER_TOOLS_GATE = 'developerTools';

const NOTICE_NO_PROFILE = 'Create a profile first.';

const NOTICE_NO_ROM = 'Add a ROM in the Library first.';

const STATE_PROBE_FRAMES = 300;

const STATE_PROBE_SLOT = 1;

const INPUT_PROBE_BOOT_FRAMES = 600;

const INPUT_PROBE_HASH_FRAME = 900;

const INPUT_PROBE_HOLD_FRAMES = 12;

const INPUT_PROBE_GAP_FRAMES = 30;

const INPUT_PROBE_BUTTONS = ['Start', 'A'];

const SRAM_PROBE_FRAMES = 300;

const SRAM_PROBE_DEFAULT_BYTES = 8192;

const SETTLE_AFTER_STATE_MS = 2000;

const FRAME_WAIT_TIMEOUT_MS = 90_000;

const DEFAULT_SCREENSHOT_FRAMES = 120;

const FRAME_COUNT_EXPORT = 'CkFrameCount';

const FRAME_WIDTH_EXPORT = 'CkFrameWidth';

const FRAME_HEIGHT_EXPORT = 'CkFrameHeight';

export {
  INPUT_PROBE_BOOT_FRAMES, INPUT_PROBE_BUTTONS, INPUT_PROBE_GAP_FRAMES, INPUT_PROBE_HOLD_FRAMES, INPUT_PROBE_HASH_FRAME,
  SRAM_PROBE_DEFAULT_BYTES, SRAM_PROBE_FRAMES,
  DEFAULT_SCREENSHOT_FRAMES, DEVELOPER_TOOLS_GATE, FUNCTION_ACTION_GATES, FRAME_COUNT_EXPORT, FRAME_HEIGHT_EXPORT, FRAME_WAIT_TIMEOUT_MS, FRAME_WIDTH_EXPORT, NOTICE_NO_PROFILE,
  NOTICE_NO_ROM, SETTLE_AFTER_STATE_MS, STATE_PROBE_FRAMES, STATE_PROBE_SLOT,
};
