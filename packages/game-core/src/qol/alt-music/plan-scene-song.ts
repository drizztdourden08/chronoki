/* @layer bridge-wasm @kind logic */
import type { PackEdit } from '../../randomizer/apply/apply-seed.type';
import { findSceneScript } from '../../randomizer/apply/script/find-scene-script';
import { walkScriptOps } from '../../script-walk/walk-script-ops';
import { OP_PLAY_SONG } from './alt-music.constants';
import type { SceneSongSpot, SongPlan } from './alt-music.type';

const planSceneSong = (pack: Uint8Array, spot: SceneSongSpot): SongPlan => {
  const name = `scene ${spot.scene} object ${spot.object} function ${spot.fn}`;
  const script = findSceneScript(pack, spot.scene);
  if (!script) return { edit: null, failed: `${name}: script not found` };
  const raw = pack.subarray(script.start, script.start + script.length);
  const hits = walkScriptOps(raw).filter(
    (o) =>
      o.object === spot.object && o.fn === spot.fn && o.op === OP_PLAY_SONG && o.length >= 2 &&
      (spot.from === null || raw[o.at + 1] === spot.from),
  );
  const hit = hits[0];
  if (hits.length !== 1 || !hit) return { edit: null, failed: `${name}: expected one play-song op, found ${hits.length}` };
  const old = raw[hit.at + 1] ?? 0;
  const edit: PackEdit = { at: script.start + hit.at + 1, old, next: spot.song, why: `${name} song ${old} to ${spot.song}` };
  return { edit, failed: null };
};

export { planSceneSong };
