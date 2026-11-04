/* @layer renderer-app @kind constants */
import { defineChannels, invoke } from '@drizztdourden08/brock-core';
import type { InvokeContract as AppInvoke } from '@app/ipc';

const APP_CHANNELS = defineChannels({
  appendEventLog: invoke<AppInvoke['eventLog:append']>()('eventLog:append'),
  getTestArgs: invoke<AppInvoke['test:getArgs']>()('test:getArgs'),
});

const APP_INVOKE_MAP = APP_CHANNELS.maps.invoke;

const APP_SEND_MAP = APP_CHANNELS.maps.send;

const APP_EVENT_MAP = APP_CHANNELS.maps.events;

export { APP_CHANNELS, APP_INVOKE_MAP, APP_SEND_MAP, APP_EVENT_MAP };
