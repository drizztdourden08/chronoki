/* @layer bridge-wasm @kind logic */
import { findSceneScript } from '../../randomizer/apply/script/find-scene-script';
import { walkScriptOps } from '../../script-walk/walk-script-ops';
import type { FastTabSpot, TabOp } from './fast-tab-spot.type';
import { TAB_FUNCTION } from './fast-tab-spots.constants';

const readTabOps = (pack: Uint8Array, spot: FastTabSpot): TabOp[] | null => {
  const script = findSceneScript(pack, spot.scene);
  if (!script) return null;
  const raw = pack.subarray(script.start, script.start + script.length);
  return walkScriptOps(raw)
    .filter((o) => o.object === spot.object && o.fn === TAB_FUNCTION)
    .map((o) => ({ op: o.op, bytes: raw.slice(o.at, o.at + o.length) }));
};

export { readTabOps };
