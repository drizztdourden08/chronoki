/* @layer bridge-wasm @kind logic */
import type { CharacterAssignment } from '../../world/recruits/character-assignment.type';
import { CHARACTER_RANDO_SPOTS } from '../../world/recruits/character-rando.constants';
import type { EditPlan, PackEdit } from '../apply-seed.type';
import { findRecruitOps } from './find-recruit-ops';
import { CHARACTER_IDS, NPC_ONLY_OPS, RECRUIT_SPOT_SCENES } from './recruit-spot-edits.constants';
import type { CtCharacter } from '../../world/ct-world-keys.type';

const planSpotScene = (pack: Uint8Array, spot: CtCharacter, kind: CtCharacter, scene: number): EditPlan => {
  const ops = findRecruitOps(pack, scene, spot);
  if (ops === null) return { edits: [], failed: [`duplicate-characters: ${spot} recruit ops not found in scene ${scene.toString(16)}`] };
  const edits = ops
    .filter((op) => op.kind === 'operand' && NPC_ONLY_OPS.includes(pack[op.at - 1] ?? -1))
    .map((op): PackEdit => ({ at: op.at, old: op.old, next: CHARACTER_IDS[kind], why: `dup-npc-${spot}-${scene.toString(16)}-o${op.object}` }));
  return { edits, failed: [] };
};

const planDuplicateNpcEdits = (pack: Uint8Array, assignment: CharacterAssignment): EditPlan => {
  const plans = CHARACTER_RANDO_SPOTS.flatMap((spot) => {
    const kind = assignment[spot] ?? spot;
    return kind === spot ? [] : (RECRUIT_SPOT_SCENES[spot] ?? []).map((scene) => planSpotScene(pack, spot, kind, scene));
  });
  return { edits: plans.flatMap((p) => p.edits), failed: plans.flatMap((p) => p.failed) };
};

export { planDuplicateNpcEdits };
