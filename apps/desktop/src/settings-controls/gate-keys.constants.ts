/* @layer renderer-app @kind data */
const GATE_KEY_PREFIX = 'gate:';

const OPTION_KEY_FEATURE: Record<string, string> = {
  widescreenAspect: 'widescreen',
  renderScale: 'renderScale',
  autoSaveIntervalSeconds: 'autoSave',
  autoSaveMaxEntries: 'autoSave',
  turboSpeed: 'turbo',
};

export { GATE_KEY_PREFIX, OPTION_KEY_FEATURE };
