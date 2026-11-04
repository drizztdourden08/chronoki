/* @layer renderer-components @kind types */
import type { RefObject } from 'react';
import type { WindowMode } from '@drizztdourden08/brock-core';
import type { CkArea, CkPresentMode } from '@chronoki/game-core';
import type { ViewportMode } from '@app/settings.type';
import type { GameLaunch } from '@app/views/GameSession';

interface GameBootArgs {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  launch: GameLaunch | null;
}

interface SessionPicture {
  frame: CkArea;
  ratio: number;
}

interface StageClassArgs {
  visible: boolean;
  gates: ReadonlySet<string>;
  mode: CkPresentMode;
}

interface SettleState {
  elapsed: number;
  fullscreenPending: boolean;
}

interface StageWait {
  id: number;
  since: number;
  fullscreen: boolean;
}

interface AspectLockArgs {
  viewport: ViewportMode;
  windowMode: WindowMode;
  isFullscreen: boolean;
  ratio: number;
}

export type { AspectLockArgs, GameBootArgs, SessionPicture, SettleState, StageClassArgs, StageWait };
