/* @layer renderer-appshell @kind types */
import type { ReactNode } from 'react';
import type { CkSettings } from '@chronoki/game-core';
import type { FunctionAction } from '@chronoki/input-mapping';

interface GameLaunch {
  id: number;
  profileId: string;
  romFile: string;
}

interface GameSessionValue {
  launch: GameLaunch | null;
  notice: string | null;
  config: string;
  settings: CkSettings;
  volume: number;
  gates: ReadonlySet<string>;
  play: () => void;
  stop: () => void;
  onStarted: () => void;
  onFunctionAction: (action: FunctionAction) => void;
}

interface GameSessionProps {
  children: ReactNode;
}

export type { GameLaunch, GameSessionProps, GameSessionValue };
