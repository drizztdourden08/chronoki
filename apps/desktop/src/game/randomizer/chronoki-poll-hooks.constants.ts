/* @layer bridge-wasm @kind constants */
const NO_COMPLETED: ReadonlySet<string> = new Set<string>();

const SAVE_LOAD_LOG = '[Local] In-game save load detected (play clock jumped): re-baselining checks';

export { NO_COMPLETED, SAVE_LOAD_LOG };
