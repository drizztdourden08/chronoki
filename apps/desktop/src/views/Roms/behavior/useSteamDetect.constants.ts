/* @layer renderer-components @kind constants */
import type { SteamDetectStatus } from '@app/ipc';

const POLL_MS = 500;

const IDLE: SteamDetectStatus = { state: 'idle', visited: 0 };

export { IDLE, POLL_MS };
