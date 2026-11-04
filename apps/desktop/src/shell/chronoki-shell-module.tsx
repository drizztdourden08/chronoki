/* @layer renderer-app @kind module */
import type { RendererModule } from '@drizztdourden08/brock-react';
import { GameSession } from '@app/views/GameSession';

const chronokiShellModule: RendererModule = { id: 'chronoki', Provider: GameSession };

export { chronokiShellModule };
