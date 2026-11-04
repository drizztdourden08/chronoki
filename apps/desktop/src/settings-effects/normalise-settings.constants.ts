/* @layer renderer-app @kind constants */
import type { AspectRatioChoice } from '@chronoki/features';

const NEW_DEFAULT_GATES: readonly string[] = ['saveStates', 'enhancedSaveSlotShortcut', 'saveOnQuit', 'sceneAdjust', 'wideSteamMargins'];

const GATES_ADDED_AFTER_FIRST_PROFILES: readonly string[] = ['gameInfo', 'perGroupVolume'];

const ALWAYS_ON_GATES: readonly string[] = ['saveStates'];

const LEGACY_ASPECT_CHOICES: readonly AspectRatioChoice[] = ['16:9', '16:10', '21:9'];

const RETIRED_SETTING_KEYS: readonly string[] = ['steamDataImported'];

export { ALWAYS_ON_GATES, GATES_ADDED_AFTER_FIRST_PROFILES, LEGACY_ASPECT_CHOICES, NEW_DEFAULT_GATES, RETIRED_SETTING_KEYS };
