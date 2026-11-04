/* @layer electron-main @kind entry */
import { bootstrapApp } from '@drizztdourden08/brock-electron/main';
import { mainModules } from '../.brock/modules.main';
import { mainBootTasks } from '../.brock/boot.main';
import { mainHandlers } from '../.brock/handlers.main';
import { product } from '../src/product';
import { CHRONOKI_AUTOMATION_FLAGS } from './automation/automation-flags.constants';
import { chronokiRendererFlags } from './automation/chronoki-renderer-flags';

bootstrapApp(product, {
  modules: mainModules,
  bootTasks: mainBootTasks,
  handlers: mainHandlers,
  automationFlags: CHRONOKI_AUTOMATION_FLAGS,
  rendererFlags: chronokiRendererFlags,
  dataDomains: [
    { domain: 'profiles', label: 'Profiles', dir: 'profiles', description: 'Each profile with its settings.', clearable: false },
    { domain: 'logs', label: 'Logs', dir: 'debug', description: 'Session and console logs.', cleanOlderThanDays: [7, 30], portable: false },
  ],
});
