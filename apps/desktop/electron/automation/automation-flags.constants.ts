/* @layer electron-main @kind constants */
const CHRONOKI_AUTOMATION_FLAGS = ['--auto-state', '--auto-start', '--probe-frames', '--probe-state', '--probe-input', '--probe-sram', '--probe-host', '--event-log'];

const GAME_LAUNCH_FLAGS = ['--auto-state', '--auto-start'];

const FORWARDED_VALUE_FLAGS = ['event-log', 'probe-frames', 'probe-input'];

const FORWARDED_BOOLEAN_FLAGS = ['auto-start', 'probe-state', 'probe-input', 'probe-sram', 'probe-host'];

const SCREENSHOT_FLAG = '--screenshot';

export { CHRONOKI_AUTOMATION_FLAGS, FORWARDED_BOOLEAN_FLAGS, FORWARDED_VALUE_FLAGS, GAME_LAUNCH_FLAGS, SCREENSHOT_FLAG };
