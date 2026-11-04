/* @layer renderer-app @kind constants */
import type { AspectRatioChoice } from '@chronoki/features';

const NEW_DEFAULT_GATES: readonly string[] = ['saveStates', 'enhancedSaveSlotShortcut', 'saveOnQuit', 'sceneAdjust', 'wideSteamMargins'];

const ALWAYS_ON_GATES: readonly string[] = ['saveStates'];

const LEGACY_ASPECT_CHOICES: readonly AspectRatioChoice[] = ['16:9', '16:10', '21:9'];

export { ALWAYS_ON_GATES, LEGACY_ASPECT_CHOICES, NEW_DEFAULT_GATES };
