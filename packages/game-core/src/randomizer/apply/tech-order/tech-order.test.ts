/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import type { PackEdit } from '../apply-seed.type';
import { applyOptionsOf } from '../enemy-difficulty/apply-options-of';
import { createRomSpace } from './create-rom-space';
import { namedTableOf } from './named-table-of';
import { planSlotPermutations } from './plan-slot-permutations';
import { planTechOrderEdits } from './plan-tech-order-edits';
import { techIdMapsOf } from './tech-id-maps-of';
import {
  CONTROL_COUNT, CONTROL_TABLE, DESC_ROW_BYTES, DESC_TABLE_NAME, FIELD_USABLE_TECH_IDS, LAST_TECH_ID, LEARN_REFS_ROM,
  MOVED_TABLES, MP_COST_TABLE_NAME, MP_INDEX_TABLE_NAME, TECH_CHARACTERS, TECH_SLOTS,
} from './tech-order.constants';
import { syntheticTechPack } from './tech-order.fixture';

const SEED = 'seed-one';
const ids = Array.from({ length: LAST_TECH_ID }, (_, i) => i + 1);

const applied = (pack: Uint8Array, edits: readonly PackEdit[]): Uint8Array => {
  const out = pack.slice();
  edits.forEach((e) => { out[e.at] = e.next; });
  return out;
};

const run = (mode: 'balanced-random' | 'full-random', seed = SEED) => {
  const pack = syntheticTechPack();
  const plan = planTechOrderEdits(pack, mode, seed);
  const perms = planSlotPermutations(mode, seed);
  return { pack, plan, perms, maps: techIdMapsOf(perms), before: createRomSpace(pack), after: createRomSpace(applied(pack, plan.edits)) };
};

describe('tech order permutations', { tags: ['critical'] }, () => {
  it('permutes the eight slots of each character and keeps field-usable techs in place', () => {
    for (const mode of ['balanced-random', 'full-random'] as const) {
      const perms = planSlotPermutations(mode, SEED);
      expect(perms).toHaveLength(TECH_CHARACTERS);
      perms.forEach((perm) => expect([...perm].sort()).toEqual([0, 1, 2, 3, 4, 5, 6, 7]));
      FIELD_USABLE_TECH_IDS.forEach((id) => expect(perms[Math.floor((id - 1) / TECH_SLOTS)]?.[(id - 1) % TECH_SLOTS]).toBe((id - 1) % TECH_SLOTS));
    }
  });

  it('is the same for the same seed and mode and differs across seeds', () => {
    expect(planSlotPermutations('full-random', SEED)).toEqual(planSlotPermutations('full-random', SEED));
    const seeds = ['a', 'b', 'c', 'd'].map((s) => JSON.stringify(planSlotPermutations('full-random', s)));
    expect(new Set(seeds).size).toBeGreaterThan(1);
  });

  it('balanced keeps the first techs early more often than a plain shuffle', () => {
    const meanSlot = (mode: 'balanced-random' | 'full-random'): number => {
      const seeds = Array.from({ length: 300 }, (_, i) => `s${i}`);
      return seeds.reduce((sum, s) => sum + (planSlotPermutations(mode, s)[0]?.[0] ?? 0), 0) / seeds.length;
    };
    expect(meanSlot('balanced-random')).toBeLessThan(meanSlot('full-random') - 0.5);
  });
});

describe('tech order edits', { tags: ['critical'] }, () => {
  it('every edit matches the pack it was planned against', () => {
    const { pack, plan } = run('full-random');
    expect(plan.failed).toEqual([]);
    expect(plan.edits.length).toBeGreaterThan(0);
    plan.edits.forEach((e) => expect(pack[e.at]).toBe(e.old));
  });

  it('moves each tech record with the tech and leaves the TP-order slots in place', () => {
    const { plan, maps, before, after } = run('full-random');
    expect(plan.failed).toEqual([]);
    MOVED_TABLES.forEach((table) => ids.forEach((id) => {
      for (let b = 0; b < table.size; b += 1) {
        expect(after.read(table.rom + maps.newIdOf(id) * table.size + b)).toBe(before.read(table.rom + id * table.size + b));
      }
    }));
  });

  it('keeps the magic gate byte in its slot and remaps the effect references', () => {
    const { maps, before, after } = run('full-random');
    const { rom, size } = CONTROL_TABLE;
    for (let k = 0; k < CONTROL_COUNT; k += 1) {
      expect(after.read(rom + k * size)).toBe(before.read(rom + k * size));
      const moved = maps.oldIdOf(k);
      [1, 2, 3, 4, 8, 9, 10].forEach((b) => expect(after.read(rom + k * size + b)).toBe(before.read(rom + moved * size + b)));
      [5, 6, 7].forEach((b) => {
        const old = before.read(rom + moved * size + b) ?? 0;
        expect(after.read(rom + k * size + b)).toBe((old & 0x80) | maps.newIdOf(old & 0x7f));
      });
    }
  });

  it('rewrites the combination requirements to the slot the required tech now sits in', () => {
    const { perms, before, after } = run('full-random');
    const groups = [{ members: [0, 1], base: 0x0c27fa }, { members: [0, 2], base: 0x0c2803 }];
    expect(before.read(LEARN_REFS_ROM)).toBe(0xc0);
    groups.forEach((group) => group.members.forEach((character, seat) => {
      for (let tech = 0; tech < 3; tech += 1) {
        const at = group.base + tech * 3 + seat;
        const level = before.read(at) ?? 0;
        expect(after.read(at)).toBe((perms[character]?.[level - 1] ?? 0) + 1);
      }
    }));
  });

  it('moves the menu tables with the techs and updates every copy of the pack bytes', () => {
    const { pack, plan, maps } = run('balanced-random');
    const edited = applied(pack, plan.edits);
    const row = (p: Uint8Array, name: string, bytes: number, id: number): number[] => {
      const t = namedTableOf(p, name);
      return Array.from(p.subarray((t?.at ?? 0) + id * bytes, (t?.at ?? 0) + (id + 1) * bytes));
    };
    ids.forEach((id) => {
      expect(row(edited, MP_COST_TABLE_NAME, 1, maps.newIdOf(id))).toEqual(row(pack, MP_COST_TABLE_NAME, 1, id));
      expect(row(edited, DESC_TABLE_NAME, DESC_ROW_BYTES, maps.newIdOf(id))).toEqual(row(pack, DESC_TABLE_NAME, DESC_ROW_BYTES, id));
    });
    const index = namedTableOf(pack, MP_INDEX_TABLE_NAME);
    const indexAfter = namedTableOf(edited, MP_INDEX_TABLE_NAME);
    for (let i = 0; i < (index?.size ?? 0); i += 1) {
      expect(edited[(indexAfter?.at ?? 0) + i]).toBe(maps.newIdOf(pack[(index?.at ?? 0) + i] ?? 0));
    }
    const names = MOVED_TABLES[4];
    const space = createRomSpace(edited);
    ids.forEach((id) => {
      const addr = (names?.rom ?? 0) + id * (names?.size ?? 0);
      const spots = space.locate(addr);
      expect(spots.length).toBeGreaterThan(1);
      expect(new Set(spots.map((at) => edited[at])).size).toBe(1);
    });
  });

  it('refuses instead of half-applying when a table is missing from the pack', () => {
    const plan = planTechOrderEdits(syntheticTechPack(false), 'full-random', SEED);
    expect(plan.failed.length).toBeGreaterThan(0);
    expect(plan.edits).toEqual([]);
    expect(planTechOrderEdits(new Uint8Array(0), 'full-random', SEED).failed.length).toBeGreaterThan(0);
  });
});

describe('tech order option', { tags: ['critical'] }, () => {
  it('stays out of the apply options unless a random mode is chosen', () => {
    expect(applyOptionsOf({}, [], SEED).techOrder).toBeUndefined();
    expect(applyOptionsOf({ techOrder: 'normal' }, [], SEED).techOrder).toBeUndefined();
    expect(applyOptionsOf({ techOrder: 'full-random' }, [], SEED)).toMatchObject({ techOrder: 'full-random', seed: SEED });
  });
});
