/* @layer renderer-components @kind constants */
const MODIFIER_CODES = new Set([
  'ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight',
  'AltLeft', 'AltRight', 'MetaLeft', 'MetaRight',
]);

const CANCEL_ARM_DELAY_MS = 150;
const LISTEN_ARM_DELAY_MS = 200;

const CONTROLS_TABS = [
  { id: 'controls', label: 'Game Controls' },
  { id: 'shortcuts', label: 'Shortcuts & Functions' },
];

export { CANCEL_ARM_DELAY_MS, CONTROLS_TABS, LISTEN_ARM_DELAY_MS, MODIFIER_CODES };
