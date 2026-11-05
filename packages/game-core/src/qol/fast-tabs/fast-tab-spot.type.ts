/* @layer bridge-wasm @kind type */
import type { ScriptSplice } from '../../randomizer/apply/script/script-splice.type';

type FastTabSpot = { scene: number; object: number; item: number };

type SpotSplices = { splices: ScriptSplice[]; notes: string[] };

type TabOp = { op: number; bytes: Uint8Array };

export type { FastTabSpot, SpotSplices, TabOp };
