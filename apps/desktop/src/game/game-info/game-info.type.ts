/* @layer bridge-wasm @kind types */
import type { GameInfoSnapshot } from '@chronoki/game-core';

type ChronokiInfoSnapshot = GameInfoSnapshot & { readonly eraName: string | null };

export type { ChronokiInfoSnapshot };
