/* @layer bridge-wasm @kind logic */
import { CONTROL_TABLE, EFFECT_REF_FLAG, EFFECT_REF_MASK, FIRST_TECH_ID } from '../tech-order/tech-order.constants';
import type { RomSpace } from '../tech-order/tech-order.type';
import {
  ATTACK_POWER_AT, ATTACK_RECORD_BYTES, ATTACK_RECORD_ROM, ATTACK_TYPE_AT, CONTROL_EFFECT_COUNT, CONTROL_FIRST_EFFECT_AT,
  DAMAGE_TYPES, LAST_CONTROLLED_TECH_ID,
} from './tech-damage.constants';

type DamageRecords = { records: number[]; failed: string[] };

const effectRefsOf = (space: RomSpace, tech: number): number[] => {
  const refs: number[] = [];
  for (let k = 0; k < CONTROL_EFFECT_COUNT; k += 1) {
    const byte = space.read(CONTROL_TABLE.rom + tech * CONTROL_TABLE.size + CONTROL_FIRST_EFFECT_AT + k);
    if (byte === undefined) return refs;
    refs.push(byte & EFFECT_REF_MASK);
    if ((byte & EFFECT_REF_FLAG) !== 0) return refs;
  }
  return refs;
};

const isDamaging = (space: RomSpace, record: number): boolean => {
  const base = ATTACK_RECORD_ROM + record * ATTACK_RECORD_BYTES;
  return DAMAGE_TYPES.has(space.read(base + ATTACK_TYPE_AT) ?? 0) && (space.read(base + ATTACK_POWER_AT) ?? 0) > 0;
};

const damageRecordsOf = (space: RomSpace): DamageRecords => {
  if (space.read(CONTROL_TABLE.rom + FIRST_TECH_ID * CONTROL_TABLE.size) === undefined) {
    return { records: [], failed: ['tech-damage: the tech control table is not in the pack'] };
  }
  const found = new Set<number>();
  for (let tech = FIRST_TECH_ID; tech <= LAST_CONTROLLED_TECH_ID; tech += 1) {
    effectRefsOf(space, tech).filter((record) => record > 0 && isDamaging(space, record)).forEach((record) => found.add(record));
  }
  return { records: [...found].sort((a, b) => a - b), failed: [] };
};

export { damageRecordsOf };
