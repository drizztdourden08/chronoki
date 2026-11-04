/* @layer shared-asset-extraction @kind types */
import type { ScriptMem } from './script-mem';

type DrawMode = 'draw' | 'hidden' | 'removed';

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

interface RunCtx {
  body: Uint8Array;
  obj: number;
  mem: ScriptMem;
  actors: Actor[];
  a: Actor;
}

type OpHandler = (c: RunCtx, addr: number, nxt: number) => number;

export type { Actor, DrawMode, OpHandler, RunCtx };
