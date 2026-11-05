/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { spliceFixture } from '../../randomizer/apply/script/script-splice.fixture';
import { spliceSceneScripts } from '../../randomizer/apply/script/splice-scene-scripts';
import { walkScriptOps } from '../../script-walk/walk-script-ops';
import type { FastTabSpot } from './fast-tab-spot.type';
import { planFastTabs } from './plan-fast-tabs';
import { planTabSplices } from './plan-tab-splices';
import { planTomasGrave } from './plan-tomas-grave';

const { entryBytes, le16, packOf } = spliceFixture;
const SPOT: FastTabSpot = { scene: 0, object: 0, item: 0xcd };
const LOCK = [0xe3, 0x00];
const FREE = [0xe3, 0x01];
const BIT = [0x65, 0x82, 0xd3];
const ADD = [0xca, 0xcd];
const TAIL = [0x4f, 0xcd, 0x00, 0xec, 0x14, 0x3d, 0x00, 0xbb, 0x00, 0xee];

const scriptWith = (fn1: number[]): number[] => {
  const pointers = [...le16(32), ...le16(33), ...new Array<number>(28).fill(0)];
  return [1, ...pointers, 0x00, ...fn1, 0x00];
};

const fn1Of = (pack: Uint8Array): number[] => {
  const raw = entryBytes(pack, 16, 7);
  const bytes = Uint8Array.from(raw);
  return walkScriptOps(bytes).filter((o) => o.fn === 1).flatMap((o) => [...bytes.subarray(o.at, o.at + o.length)]);
};

const run = (fn1: number[], plan: (p: Uint8Array) => { splices: Parameters<typeof spliceSceneScripts>[1] }): number[] => {
  const pack = packOf(scriptWith(fn1));
  const result = spliceSceneScripts(pack, plan(pack).splices);
  if (!result.ok) throw new Error(result.failed.join(';'));
  return fn1Of(result.bytes);
};

describe('planTabSplices', { tags: ['critical'] }, () => {
  it('removes every explore op and leaves a bit that already precedes the add', () => {
    const out = run([...LOCK, ...BIT, 0x91, ...ADD, ...TAIL, ...FREE], (p) => planTabSplices(p, SPOT));
    expect(out).toEqual([...BIT, 0x91, ...ADD, ...TAIL, 0x00]);
  });

  it('moves a late looted bit in front of the add', () => {
    const out = run([...LOCK, 0x91, ...ADD, ...TAIL, ...BIT, ...FREE], (p) => planTabSplices(p, SPOT));
    expect(out).toEqual([0x91, ...BIT, ...ADD, ...TAIL, 0x00]);
  });

  it('skips and logs a spot whose scene is missing', () => {
    const plan = planTabSplices(packOf(scriptWith([...ADD])), { ...SPOT, scene: 5 });
    expect(plan.splices).toEqual([]);
    expect(plan.notes).toHaveLength(1);
  });

  it('skips a spot whose tab item differs', () => {
    const plan = planTabSplices(packOf(scriptWith([...LOCK, ...ADD, ...FREE])), { ...SPOT, item: 0xcf });
    expect(plan.splices).toEqual([]);
  });
});

describe('planTomasGrave', { tags: ['critical'] }, () => {
  it('moves the first lock to just before the run op', () => {
    const run7 = [0xe7, 0x00, 0x00];
    const out = run([...LOCK, 0x91, ...ADD, ...run7, ...FREE], (p) => planTomasGrave(p, SPOT));
    expect(out).toEqual([0x91, ...ADD, ...LOCK, ...run7, ...FREE, 0x00]);
  });
});

describe('planFastTabs', { tags: ['critical'] }, () => {
  it('plans nothing and logs every spot on a pack without those scenes', () => {
    const plan = planFastTabs(packOf(scriptWith([...ADD])));
    expect(plan.splices).toEqual([]);
    expect(plan.notes?.length).toBe(16);
  });
});
