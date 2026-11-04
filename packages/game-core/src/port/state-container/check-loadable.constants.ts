/* @layer bridge-wasm @kind constants */
const PIN_SHORT = 7;

const MESSAGE_NOT_A_STATE = 'This file is not a save state.';

const SECTION_LABELS: Readonly<Record<string, string>> = {
  CORE: 'game memory',
  SCEN: 'scene',
  HOST: 'game mode',
  WRLD: 'overworld',
  MENU: 'menu',
  MPIC: 'menu picture',
  APU: 'sound',
  APUH: 'sound timing',
};

const SECTION_LABEL_UNKNOWN = 'unknown';

export { MESSAGE_NOT_A_STATE, PIN_SHORT, SECTION_LABELS, SECTION_LABEL_UNKNOWN };
