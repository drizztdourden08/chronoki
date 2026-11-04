/* @layer bridge-wasm @kind types */
import type { GateSignal } from '@drizztdourden08/brock-game-info';
import type { GameInfoSnapshot } from '@chronoki/game-core';

type NameTable = Readonly<Record<number, string>>;

type ChronokiInfoSnapshot = GameInfoSnapshot & {
  readonly eraName: string | null;
  readonly itemNames: NameTable;
  readonly techNames: NameTable;
};

type GameInfoLock = NonNullable<ReturnType<GateSignal['get']>>;

export type { ChronokiInfoSnapshot, GameInfoLock, NameTable };
