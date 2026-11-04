/* @layer renderer-components @kind types */
import type { RefObject } from 'react';
import type { GameLaunch } from '@app/views/GameSession';

interface GameBootArgs {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  launch: GameLaunch | null;
}

export type { GameBootArgs };
