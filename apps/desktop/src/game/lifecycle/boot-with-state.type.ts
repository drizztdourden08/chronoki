/* @layer bridge-wasm @kind types */
import type { ActiveGame } from './active-game.type';

type Booted = { game: ActiveGame; loaded: boolean } | null;

export type { Booted };
