/* @layer renderer-app @kind module */
import type { RendererModule } from '@drizztdourden08/brock-react';
import { GameSession } from '@app/views/GameSession';
import { CHRONOKI_MENU } from './chronoki-menu.constants';

const chronokiShellModule: RendererModule = { id: 'chronoki', Provider: GameSession, menu: CHRONOKI_MENU };

export { chronokiShellModule };
