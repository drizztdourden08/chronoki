/* @layer renderer-app @kind constants */
import { defineChannels, invoke } from '@drizztdourden08/brock-core';
import type { InvokeContract as AppInvoke } from '@app/ipc';

const APP_CHANNELS = defineChannels({
  appendEventLog: invoke<AppInvoke['eventLog:append']>()('eventLog:append'),
  getTestArgs: invoke<AppInvoke['test:getArgs']>()('test:getArgs'),
  steamDetectStart: invoke<AppInvoke['steam:detectStart']>()('steam:detectStart'),
  steamDetectCancel: invoke<AppInvoke['steam:detectCancel']>()('steam:detectCancel'),
  steamDetectStatus: invoke<AppInvoke['steam:detectStatus']>()('steam:detectStatus'),
  steamPick: invoke<AppInvoke['steam:pick']>()('steam:pick'),
  steamReadRange: invoke<AppInvoke['steam:readRange']>()('steam:readRange'),
});

const APP_INVOKE_MAP = APP_CHANNELS.maps.invoke;

const APP_SEND_MAP = APP_CHANNELS.maps.send;

const APP_EVENT_MAP = APP_CHANNELS.maps.events;

export { APP_CHANNELS, APP_INVOKE_MAP, APP_SEND_MAP, APP_EVENT_MAP };
