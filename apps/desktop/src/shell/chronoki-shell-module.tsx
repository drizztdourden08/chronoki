/* @layer renderer-app @kind module */
import type { RendererModule } from '@drizztdourden08/brock-react';
import { GameSession } from '@app/views/GameSession';
import { CHRONOKI_LOG_CHANNELS } from '@app/log/log-channels.constants';
import { CHRONOKI_MENU } from './chronoki-menu.constants';

const chronokiShellModule: RendererModule = { id: 'chronoki', Provider: GameSession, logChannels: CHRONOKI_LOG_CHANNELS, menu: CHRONOKI_MENU };

export { chronokiShellModule };
