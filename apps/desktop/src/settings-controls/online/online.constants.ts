/* @layer renderer-app @kind constants */
import type { SessionSwitch } from './online.type';

const SESSION_SWITCHES: Readonly<Record<string, SessionSwitch>> = {
  'session.deathLink': { field: 'deathLink', fallback: false },
  'session.trackOtherPlayers': { field: 'trackOtherPlayers', fallback: true },
};

export { SESSION_SWITCHES };
