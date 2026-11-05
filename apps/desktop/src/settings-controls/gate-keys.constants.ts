/* @layer renderer-app @kind data */
const GATE_KEY_PREFIX = 'gate:';

const OPTION_KEY_FEATURE: Record<string, string> = {
  aspectRatio: 'widescreen',
  customAspectW: 'widescreen',
  customAspectH: 'widescreen',
  renderScale: 'renderScale',
  autoSaveIntervalSeconds: 'autoSave',
  autoSaveMaxEntries: 'autoSave',
  turboSpeed: 'turbo',
  saveHoldDuration: 'enhancedSaveSlotShortcut',
  dialogSpeed: 'dialogControls',
  dialogHoldSpeed: 'dialogControls',
  dialogHoldToAccelerate: 'dialogControls',
  dialogFillOnB: 'dialogControls',
};

export { GATE_KEY_PREFIX, OPTION_KEY_FEATURE };
