/* @layer bridge-wasm @kind types */
import type { GateSignal } from '@drizztdourden08/brock-game-info';
import type { GameInfoSnapshot } from '@chronoki/game-core';

type ChronokiInfoSnapshot = GameInfoSnapshot & { readonly eraName: string | null };

type GameInfoLock = NonNullable<ReturnType<GateSignal['get']>>;

export type { ChronokiInfoSnapshot, GameInfoLock };
