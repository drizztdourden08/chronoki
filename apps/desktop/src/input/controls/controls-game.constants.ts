/* @layer renderer-components @kind constants */
import { DEFAULT_FUNCTION_MAPPINGS, KEYBOARD_DEFAULT } from '@chronoki/input-mapping';
import type { ActionBinding } from '@drizztdourden08/brock-input';
import type { ControlsGame } from '@drizztdourden08/brock-input/renderer';
import { presetMappings } from '../profile-edit/preset-mappings';
import { CONTROLS_TABS } from './controls.constants';
import { functionToAction } from './function-mapping-convert';
import { mappingToAction } from './profile-to-brock';

const FUNCTION_DEFAULT_BINDINGS: readonly ActionBinding[] = DEFAULT_FUNCTION_MAPPINGS.map(functionToAction);

const CONTROLS_GAME: ControlsGame = {
  tabs: CONTROLS_TABS,
  keyboardDefaults: KEYBOARD_DEFAULT.defaultMappings.map(mappingToAction),
  defaultBindings: (device) => presetMappings(device).map(mappingToAction),
};

export { CONTROLS_GAME, FUNCTION_DEFAULT_BINDINGS };
