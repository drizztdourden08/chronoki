/* @layer shared @kind constants */
const VANILLA_SAFE_LOCKED_SETTINGS: ReadonlySet<string> = new Set([
  'developerToolsEnabled',
  'enableMSU',
  'msuConfigMode',
  'resumeMSU',
  'resetMSUAtTitle',
  'msuChipFallback',
  'packReplaceSfx',
  'dialogSpeed',
  'dialogHoldSpeed',
  'dialogHoldToAccelerate',
  'dialogFillOnB',
  'dialogAutoSkip',
  'haptics.enabled',
]);

export { VANILLA_SAFE_LOCKED_SETTINGS };
