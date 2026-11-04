/* @layer renderer-appshell @kind types */
import type { ReactNode } from 'react';
import type { CkArea, CkSettings } from '@chronoki/game-core';
import type { FunctionAction } from '@chronoki/input-mapping';

interface GameLaunch {
  id: number;
  profileId: string;
  romFile: string;
}

interface GameSessionValue {
  launch: GameLaunch | null;
  notice: string | null;
  running: boolean;
  paused: boolean;
  config: string;
  settings: CkSettings;
  volume: number;
  gates: ReadonlySet<string>;
  pictureRatio: number;
  setStageArea: (area: CkArea) => void;
  play: () => void;
  stop: () => void;
  reset: () => void;
  togglePause: () => void;
  onStarted: () => void;
  onFunctionAction: (action: FunctionAction) => void;
  onFunctionRelease: (action: FunctionAction) => void;
}

interface GameSessionProps {
  children: ReactNode;
}

export type { GameLaunch, GameSessionProps, GameSessionValue };
