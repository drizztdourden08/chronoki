/* @layer renderer-appshell @kind logic */
import { closeSaveOverlay } from '@app/game/save-overlay';
import { setTurboHeld } from '@app/game/turbo';
import type { FunctionAction } from '@chronoki/input-mapping';
import { currentSlot } from './current-slot';
import { loadFromSlot } from './load-from-slot';
import { cycleProfile } from './cycle-profile';
import { pressSaveKey } from './press-save-key';
import { stepSlot } from './step-slot';
import { takeScreenshot } from './take-screenshot';

const FUNCTION_HANDLERS: Partial<Record<FunctionAction, () => void | Promise<void>>> = {
  'fast-forward': () => setTurboHeld(true),
  'slot-next': () => stepSlot(1),
  'slot-prev': () => stepSlot(-1),
  'save-state': pressSaveKey,
  'load-state': () => loadFromSlot(currentSlot()),
  menu: closeSaveOverlay,
  screenshot: takeScreenshot,
  'profile-prev': () => cycleProfile(-1),
  'profile-next': () => cycleProfile(1),
};

export { FUNCTION_HANDLERS };
