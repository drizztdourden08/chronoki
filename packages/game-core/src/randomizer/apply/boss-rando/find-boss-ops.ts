/* @layer bridge-wasm @kind logic */
import { walkScriptOps } from '../../../script-walk/walk-script-ops';
import { findSceneScript } from '../script/find-scene-script';
import { OP_LOAD_ENEMY } from './boss-rando.constants';
import type { BossOp, BossSpot } from './boss-rando.type';

const opInScene = (pack: Uint8Array, scene: number, enemy: number): BossOp | null => {
  const script = findSceneScript(pack, scene);
  if (!script) return null;
  const raw = pack.subarray(script.start, script.start + script.length);
  const hits = walkScriptOps(raw).filter((o) => o.op === OP_LOAD_ENEMY && raw[o.at + 1] === enemy);
  const hit = hits[0];
  return hits.length === 1 && hit ? { at: script.start + hit.at + 1, enemy, slot: raw[hit.at + 2] ?? 0 } : null;
};

const findBossOps = (pack: Uint8Array, spot: BossSpot): BossOp[] | null => {
  const ops = spot.scenes.map((scene) => opInScene(pack, scene, spot.enemy));
  return ops.every((op) => op !== null) ? (ops as BossOp[]) : null;
};

export { findBossOps };
