/* @layer bridge-wasm @kind logic */
import {
  CC_BANK_ROM, LEARN_REF_BYTES, LEARN_REF_END, LEARN_REF_LIMIT, LEARN_REFS_ROM, LEARN_REQ_BYTES, TECH_CHARACTERS, TECH_SLOTS,
} from './tech-order.constants';
import type { TechIdMaps } from './tech-id-maps-of';
import type { RomSpace, RomStage } from './tech-order.type';

const SEAT_MASK = 0x80;

const membersOf = (mask: number): number[] =>
  Array.from({ length: TECH_CHARACTERS }, (_, c) => c).filter((c) => (mask & (SEAT_MASK >> c)) !== 0);

const remapLevel = (maps: TechIdMaps, character: number, level: number): number =>
  level >= 1 && level <= TECH_SLOTS ? maps.slotOf(character, level - 1) + 1 : level;

const planLearnReqEdits = (space: RomSpace, stage: RomStage, maps: TechIdMaps): string[] => {
  const failed: string[] = [];
  const done = new Set<number>();
  for (let ref = 0; ref < LEARN_REF_LIMIT; ref += 1) {
    const at = LEARN_REFS_ROM + ref * LEARN_REF_BYTES;
    const mask = space.read(at);
    if (mask === undefined) {
      failed.push('tech-order: the combination table is not in the pack');
      break;
    }
    if (mask === LEARN_REF_END) break;
    const count = space.read(at + 2) ?? 0;
    const pointer = (space.read(at + 3) ?? 0) | ((space.read(at + 4) ?? 0) << 8);
    membersOf(mask).forEach((character, seat) => {
      for (let tech = 0; tech < count; tech += 1) {
        const reqAt = CC_BANK_ROM + pointer + tech * LEARN_REQ_BYTES + seat;
        const level = space.read(reqAt);
        if (level === undefined) failed.push(`tech-order: requirement ${reqAt.toString(16)} is not in the pack`);
        else if (!done.has(reqAt)) {
          done.add(reqAt);
          stage.put(reqAt, remapLevel(maps, character, level), `tech-order: combination ${ref} requirement`);
        }
      }
    });
  }
  return failed;
};

export { planLearnReqEdits };
