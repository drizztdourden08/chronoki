/* @layer renderer-app @kind constants */
const RESTART_TOAST_ID = 'restart-required';

const RESTART_TOAST_MESSAGE = 'Some changes require a game restart to take effect';

const RESTART_ALWAYS_KEYS: readonly string[] = ['vanillaSafe', 'aspectRatio', 'customAspectW', 'customAspectH', 'pixelPerfect'];

export { RESTART_ALWAYS_KEYS, RESTART_TOAST_ID, RESTART_TOAST_MESSAGE };
