/* @layer renderer-app @kind types */
import type { APP_EVENT_MAP, APP_INVOKE_MAP, APP_SEND_MAP } from './contract.constants';

interface AppMaps {
  invoke: typeof APP_INVOKE_MAP;
  send: typeof APP_SEND_MAP;
  events: typeof APP_EVENT_MAP;
}

export type { AppMaps };
