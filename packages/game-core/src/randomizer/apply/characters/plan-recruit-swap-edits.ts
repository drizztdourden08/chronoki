/* @layer bridge-wasm @kind logic */
import type { CharacterAssignment } from '../../world/recruits/character-assignment.type';
import { CHARACTER_RANDO_SPOTS } from '../../world/recruits/character-rando.constants';
import type { EditPlan, PackEdit } from '../apply-seed.type';
import { findRecruitOps } from './find-recruit-ops';
import { CHARACTER_IDS, FIXED_LOADER_OPS, RECRUIT_SPOT_SCENES } from './recruit-spot-edits.constants';
import type { CtCharacter } from '../../world/ct-world-keys.type';

const planSpotScene = (pack: Uint8Array, spot: CtCharacter, target: CtCharacter, scene: number): EditPlan => {
  const ops = findRecruitOps(pack, scene, spot);
  if (ops === null) return { edits: [], failed: [`character-rando: ${spot} recruit ops not found in scene ${scene.toString(16)}`] };
  const edits = ops.map((op): PackEdit => ({
    at: op.at,
    old: op.old,
    next: op.kind === 'opcode' ? FIXED_LOADER_OPS[target] : CHARACTER_IDS[target],
    why: `character-rando-${spot}-${scene.toString(16)}-o${op.object}`,
  }));
  return { edits, failed: [] };
};

const planRecruitSwapEdits = (pack: Uint8Array, assignment: CharacterAssignment): EditPlan => {
  const plans = CHARACTER_RANDO_SPOTS.flatMap((spot) => {
    const target = assignment[spot] ?? spot;
    return target === spot ? [] : (RECRUIT_SPOT_SCENES[spot] ?? []).map((scene) => planSpotScene(pack, spot, target, scene));
  });
  return { edits: plans.flatMap((p) => p.edits), failed: plans.flatMap((p) => p.failed) };
};

export { planRecruitSwapEdits };
