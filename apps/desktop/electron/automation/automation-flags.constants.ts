/* @layer electron-main @kind constants */
const CHRONOKI_AUTOMATION_FLAGS = ['--auto-state', '--auto-start', '--probe-frames', '--probe-state', '--event-log'];

const GAME_LAUNCH_FLAGS = ['--auto-state', '--auto-start'];

const FORWARDED_VALUE_FLAGS = ['event-log', 'probe-frames'];

const FORWARDED_BOOLEAN_FLAGS = ['auto-start', 'probe-state'];

const SCREENSHOT_FLAG = '--screenshot';

export { CHRONOKI_AUTOMATION_FLAGS, FORWARDED_BOOLEAN_FLAGS, FORWARDED_VALUE_FLAGS, GAME_LAUNCH_FLAGS, SCREENSHOT_FLAG };
