/* @layer renderer-app @kind module */
import type { RendererModule } from '@drizztdourden08/brock-react';
import { CHRONOKI_LOG_CHANNELS } from '@app/log/log-channels.constants';
import { CHRONOKI_MENU } from './chronoki-menu.constants';
import { ChronokiProviders } from './ChronokiProviders';

const chronokiShellModule: RendererModule = { id: 'chronoki', Provider: ChronokiProviders, logChannels: CHRONOKI_LOG_CHANNELS, menu: CHRONOKI_MENU };

export { chronokiShellModule };
