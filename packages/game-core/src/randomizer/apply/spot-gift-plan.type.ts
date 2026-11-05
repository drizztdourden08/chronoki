/* @layer bridge-wasm @kind type */
import type { ScriptSplice } from './script/script-splice.type';

type SpotGiftPlan = { splices: ScriptSplice[]; failed: string[] };

export type { SpotGiftPlan };
