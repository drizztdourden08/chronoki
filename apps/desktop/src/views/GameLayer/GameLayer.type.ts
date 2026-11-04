/* @layer renderer-components @kind types */
import type { RefObject } from 'react';
import type { ViewportMode } from '@app/settings.type';
import type { GameLaunch } from '@app/views/GameSession';

interface GameBootArgs {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  launch: GameLaunch | null;
}

interface StageClassArgs {
  visible: boolean;
  gates: ReadonlySet<string>;
  viewport: ViewportMode;
  pixelPerfect: boolean;
}

export type { GameBootArgs, StageClassArgs };
