/* @layer shared-asset-extraction @kind types */
import type { ScriptMem } from './script-mem';

type DrawMode = 'draw' | 'hidden' | 'removed';

/** One scene object as extract_actors resolves it. */
interface Actor {
  obj: number;
  sprite: number | null;
  pos: [number, number] | null;
  facing: number;
  draw: DrawMode;
  dead: boolean;
  defined: boolean;
  visible: boolean;
}

/** What an op handler sees: the script body, the shared WRAM, every actor and the one that runs. */
interface RunCtx {
  body: Uint8Array;
  obj: number;
  mem: ScriptMem;
  actors: Actor[];
  a: Actor;
}

/** An op's effect; it answers the address of the next op (the default is addr + length). */
type OpHandler = (c: RunCtx, addr: number, nxt: number) => number;

export type { Actor, DrawMode, OpHandler, RunCtx };
