/* @layer renderer-appshell @kind logic */
import { saveOverlayStore } from '@app/stores/save-overlay-store';
import { setTurboHeld } from '@app/game/turbo';
import { toggleDebugCapture } from '@app/bug-report/debug-capture/toggle-debug-capture';
import type { FunctionAction } from '@chronoki/input-mapping';
import { currentSlot } from './current-slot';
import { loadFromSlot } from './load-from-slot';
import { cycleProfile } from './cycle-profile';
import { saveStateKey } from './save-state-key';
import { stepSlot } from './step-slot';
import { takeScreenshot } from './take-screenshot';
import { toggleFullscreen } from './toggle-fullscreen';

const FUNCTION_HANDLERS: Partial<Record<FunctionAction, () => void | Promise<void>>> = {
  turbo: () => setTurboHeld(true),
  fullscreen: toggleFullscreen,
  'toggle-debug-capture': toggleDebugCapture,
  'slot-next': () => stepSlot(1),
  'slot-prev': () => stepSlot(-1),
  'save-state': saveStateKey,
  'load-state': () => loadFromSlot(currentSlot()),
  menu: saveOverlayStore.hide,
  screenshot: takeScreenshot,
  'profile-prev': () => cycleProfile(-1),
  'profile-next': () => cycleProfile(1),
};

export { FUNCTION_HANDLERS };
