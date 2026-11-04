/* @layer bridge-wasm @kind constants */
const RUNNING_STATUS = 'running';

const SESSION_LIVE_STATUSES: ReadonlySet<string> = new Set(['running', 'paused']);

export { RUNNING_STATUS, SESSION_LIVE_STATUSES };
