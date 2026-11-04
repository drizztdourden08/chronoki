/* @layer electron-main @kind entry */
import { bootstrapApp } from '@drizztdourden08/brock-electron/main';
import { mainModules } from '../.brock/modules.main';
import { mainBootTasks } from '../.brock/boot.main';
import { mainHandlers } from '../.brock/handlers.main';
import { product } from '../src/product';
import { CHRONOKI_DATA_DOMAINS } from '../src/storage/data-domains.constants';
import { CHRONOKI_AUTOMATION_FLAGS } from './automation/automation-flags.constants';
import { chronokiRendererFlags } from './automation/chronoki-renderer-flags';

bootstrapApp(product, {
  modules: mainModules,
  bootTasks: mainBootTasks,
  handlers: mainHandlers,
  automationFlags: CHRONOKI_AUTOMATION_FLAGS,
  rendererFlags: chronokiRendererFlags,
  dataDomains: CHRONOKI_DATA_DOMAINS,
});
