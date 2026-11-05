/* @layer bridge-wasm @kind logic */
import { createRng } from '@drizztdourden08/brock-randomizer/world';
import type { EditPlan, PackEdit } from '../apply-seed.type';
import { appliedTo } from '../band-rando/applied-to';
import { BYTE_MAX, TECH_BAND } from '../band-rando/band-rando.constants';
import { rebasedEdits } from '../band-rando/rebase-edits';
import { scaledValueOf } from '../band-rando/scaled-value-of';
import { createRomSpace } from '../tech-order/create-rom-space';
import { createRomStage } from '../tech-order/create-rom-stage';
import { damageRecordsOf } from './damage-records-of';
import { ATTACK_POWER_AT, ATTACK_RECORD_BYTES, ATTACK_RECORD_ROM, TECH_DAMAGE_STREAM } from './tech-damage.constants';

const planTechDamageEdits = (pack: Uint8Array, seed: string, prior: readonly PackEdit[] = []): EditPlan => {
  const ordered = appliedTo(pack, prior);
  const space = createRomSpace(ordered);
  const stage = createRomStage(ordered, space);
  const rng = createRng(`${seed}${TECH_DAMAGE_STREAM}`);
  const { records, failed } = damageRecordsOf(space);
  records.forEach((record) => {
    const at = ATTACK_RECORD_ROM + record * ATTACK_RECORD_BYTES + ATTACK_POWER_AT;
    const power = space.read(at) ?? 0;
    stage.put(at, scaledValueOf(power, TECH_BAND, rng.next(), BYTE_MAX), `tech-damage: attack record ${record.toString(16)}`);
  });
  return { edits: failed.length > 0 ? [] : rebasedEdits(pack, stage.edits()), failed };
};

export { planTechDamageEdits };
