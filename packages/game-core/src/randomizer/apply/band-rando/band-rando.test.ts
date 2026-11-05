/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import type { PackEdit } from '../apply-seed.type';
import { applyOptionsOf } from '../enemy-difficulty/apply-options-of';
import { planGearRandoEdits } from '../gear-rando/plan-gear-rando-edits';
import { HEAL_AMOUNT_TABLE, HEAL_RECORD_ROM } from '../healing-rando/healing-rando.constants';
import { planHealingRandoEdits } from '../healing-rando/plan-healing-rando-edits';
import { damageRecordsOf } from '../tech-damage/damage-records-of';
import { planTechDamageEdits } from '../tech-damage/plan-tech-damage-edits';
import { ATTACK_POWER_AT, ATTACK_RECORD_BYTES, ATTACK_RECORD_ROM } from '../tech-damage/tech-damage.constants';
import { createRomSpace } from '../tech-order/create-rom-space';
import { namedTableOf } from '../tech-order/named-table-of';
import { planTechOrderEdits } from '../tech-order/plan-tech-order-edits';
import { syntheticTechPack } from '../tech-order/tech-order.fixture';
import { appliedTo } from './applied-to';
import { syntheticBandPack } from './band-rando.fixture';
import { rankKeptValuesOf } from './rank-kept-values-of';

const BAND = { min: 0.5, max: 1.5 };
const read = (pack: Uint8Array, addr: number): number | undefined => createRomSpace(pack).read(addr);
const power = (pack: Uint8Array, record: number): number | undefined => read(pack, ATTACK_RECORD_ROM + record * ATTACK_RECORD_BYTES + ATTACK_POWER_AT);
const matchesPack = (pack: Uint8Array, edits: readonly PackEdit[]): void => edits.forEach((e) => expect(pack[e.at]).toBe(e.old));
const stat = (p: Uint8Array, addr: number): number => read(p, addr) ?? 0;
const swordsOf = (out: Uint8Array): number[] => [1, 2, 3].map((id) => stat(out, 0x0c0262 + id * 5));
const differsFrom = (out: Uint8Array, base: Uint8Array): boolean => out.some((b, i) => b !== base[i]);
const HEAL_MULTS = [1, 4, 10, 1, 3, 6];
const healAmountOf = (p: Uint8Array, index: number): number => {
  const t = namedTableOf(p, HEAL_AMOUNT_TABLE);
  return t === null ? -1 : (p[t.at + index * 2] ?? 0) | ((p[t.at + index * 2 + 1] ?? 0) << 8);
};
const healAmountsOf = (out: Uint8Array): number[] =>
  [1, 2, 3, 4, 5, 6].map((index, i) => {
    const record = HEAL_RECORD_ROM + index * 4;
    expect((read(out, record + 3) ?? 0) * (HEAL_MULTS[i] ?? 1)).toBe(healAmountOf(out, index));
    return healAmountOf(out, index);
  });

describe('band randomization helpers', { tags: ['critical'] }, () => {
  it('keeps the order of the values and stays inside the limit', () => {
    const values = [5, 40, 12, 12, 90];
    const out = rankKeptValuesOf(values, BAND, [0.9, 0.1, 0.5, 0.2, 0.7], 100);
    const order = [0, 2, 3, 1, 4];
    order.slice(1).forEach((index, i) => expect(out[index] ?? 0).toBeGreaterThanOrEqual(out[order[i] ?? 0] ?? 0));
    out.forEach((v) => {
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(100);
    });
  });
});

describe('gear randomization', { tags: ['critical'] }, () => {
  const pack = syntheticBandPack();
  const after = (seed: string): Uint8Array => appliedTo(pack, planGearRandoEdits(pack, seed).edits);

  it('plans edits that match the pack and are the same for the same seed', () => {
    const plan = planGearRandoEdits(pack, 'seed-a');
    expect(plan.failed).toEqual([]);
    matchesPack(pack, plan.edits);
    expect(plan.edits).toEqual(planGearRandoEdits(pack, 'seed-a').edits);
  });

  it('keeps weapons of one class in order, near vanilla, and changes something for some seed', () => {
    const changed = ['a', 'b', 'c', 'd', 'e'].map((seed) => {
      const out = after(seed);
      const swords = swordsOf(out);
      expect(swords[0]).toBeLessThanOrEqual(swords[1] ?? 0);
      expect(swords[1]).toBeLessThanOrEqual(swords[2] ?? 0);
      expect(swords[0]).toBeGreaterThanOrEqual(Math.floor(5 * 0.75));
      expect(swords[2]).toBeLessThanOrEqual(Math.ceil(50 * 1.25));
      expect(stat(out, 0x0c047e)).toBeGreaterThanOrEqual(Math.floor(30 * 0.75));
      expect(stat(out, 0x0c047e)).toBeLessThanOrEqual(Math.ceil(30 * 1.25));
      return differsFrom(out, pack);
    });
    expect(changed).toContain(true);
  });
});

describe('healing item randomization', { tags: ['critical'] }, () => {
  const pack = syntheticBandPack();
  it('keeps the battle record and the field table in agreement, in order, inside the band', () => {
    ['a', 'b', 'c'].forEach((seed) => {
      const plan = planHealingRandoEdits(pack, seed);
      expect(plan.failed).toEqual([]);
      matchesPack(pack, plan.edits);
      const out = appliedTo(pack, plan.edits);
      const amounts = healAmountsOf(out);
      expect(amounts[0]).toBeLessThanOrEqual(amounts[1] ?? 0);
      expect(amounts[1]).toBeLessThanOrEqual(amounts[2] ?? 0);
      expect(amounts[3]).toBeLessThanOrEqual(amounts[4] ?? 0);
      expect(amounts[4]).toBeLessThanOrEqual(amounts[5] ?? 0);
      expect(amounts[2]).toBeLessThanOrEqual(999);
      expect(healAmountOf(out, 7)).toBe(0);
    });
  });

  it('is the same for the same seed and reports a pack without the effect tables', () => {
    expect(planHealingRandoEdits(pack, 's').edits).toEqual(planHealingRandoEdits(pack, 's').edits);
    expect(planHealingRandoEdits(syntheticBandPack(false), 's').failed).toHaveLength(1);
  });
});

describe('tech damage randomization', { tags: ['critical'] }, () => {
  const pack = syntheticBandPack();

  it('scales only the damaging records a tech uses, each inside the band', () => {
    const plan = planTechDamageEdits(pack, 'seed-a');
    expect(plan.failed).toEqual([]);
    matchesPack(pack, plan.edits);
    const out = appliedTo(pack, plan.edits);
    [[1, 10], [2, 20], [4, 40]].forEach(([record, vanilla]) => {
      expect(power(out, record ?? 0)).toBeGreaterThanOrEqual(Math.floor((vanilla ?? 0) * 0.5));
      expect(power(out, record ?? 0)).toBeLessThanOrEqual(Math.ceil((vanilla ?? 0) * 1.5));
    });
    expect(power(out, 3)).toBe(8);
    expect(power(out, 5)).toBe(30);
    expect(planTechDamageEdits(pack, 'seed-a').edits).toEqual(plan.edits);
  });

  it('follows the techs after the tech order moved them', () => {
    const techPack = syntheticTechPack();
    const space = createRomSpace(techPack);
    for (let record = 1; record <= 10; record += 1) {
      const base = ATTACK_RECORD_ROM + record * ATTACK_RECORD_BYTES;
      space.locate(base + 5).forEach((at) => { techPack[at] = 1; });
      space.locate(base + ATTACK_POWER_AT).forEach((at) => { techPack[at] = 20; });
    }
    const order = planTechOrderEdits(techPack, 'full-random', 'seed-a');
    const ordered = appliedTo(techPack, order.edits);
    const plan = planTechDamageEdits(techPack, 'seed-a', order.edits);
    expect(plan.failed).toEqual([]);
    matchesPack(techPack, plan.edits);
    const final = appliedTo(ordered, plan.edits);
    const { records } = damageRecordsOf(createRomSpace(ordered));
    expect(records.length).toBeGreaterThan(0);
    records.forEach((record) => {
      expect(power(final, record)).toBeGreaterThanOrEqual(Math.floor((power(ordered, record) ?? 0) * 0.5));
      expect(power(final, record)).toBeLessThanOrEqual(Math.ceil((power(ordered, record) ?? 0) * 1.5));
    });
  });
});

describe('randomization options', { tags: ['critical'] }, () => {
  it('stay out of the apply options when off and set the seed when on', () => {
    expect(applyOptionsOf({}, [], 'seed')).not.toHaveProperty('gearRando');
    expect(applyOptionsOf({}, [], 'seed')).not.toHaveProperty('seed');
    const on = applyOptionsOf({ gearRando: true, healingRando: true, techDamageRando: true }, [], 'seed');
    expect(on).toMatchObject({ gearRando: true, healingRando: true, techDamageRando: true, seed: 'seed' });
  });
});
