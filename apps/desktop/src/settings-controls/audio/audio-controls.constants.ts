/* @layer renderer-app @kind constants */
const VOLUME_ROWS = {
  masterVolume: { mutedKey: 'masterMuted' },
  musicVolume: { mutedKey: 'musicMuted' },
  sfxVolume: { mutedKey: 'sfxMuted' },
} as const;

const GROUP_VOLUME_KEYS: readonly string[] = ['musicVolume', 'sfxVolume'];

const PACK_DEPENDENT_KEYS: readonly string[] = ['resumeMSU', 'resetMSUAtTitle', 'msuChipFallback', 'packReplaceSfx'];

export { GROUP_VOLUME_KEYS, PACK_DEPENDENT_KEYS, VOLUME_ROWS };
