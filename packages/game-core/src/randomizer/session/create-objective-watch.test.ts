/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { createModeHooks } from './create-mode-hooks';
import { createObjectiveWatch } from './create-objective-watch';
import { fakeView } from './memory-view.fake';
import { OBJECTIVE_GATE_AT, OBJECTIVE_LATCH_AT } from './objective-watch.constants';
import type { ObjectiveSource } from '../world/bucket/objective-def.type';

const HIT = 0x10000 + 0x01a3;
const SETTLED = 0x10000 + 0x00a3;
const sources: ObjectiveSource[] = [
  { type: 'flag', at: HIT, mask: 0x02, settle: false },
  { type: 'flag', at: SETTLED, mask: 0x04, settle: true },
];

const setup = (needed: number) => {
  const writes: [number, number][] = [];
  const logs: string[] = [];
  const write = (offset: number, bytes: Uint8Array): boolean => {
    writes.push([offset, bytes[0] ?? 0]);
    return true;
  };
  return { writes, logs, watch: createObjectiveWatch(write, sources, needed, (line) => logs.push(line)) };
};

describe('createObjectiveWatch', { tags: ['critical'] }, () => {
  it('latches an immediate flag, logs progress and opens the gate once enough are done', () => {
    const { writes, logs, watch } = setup(1);
    watch.observe(fakeView({ [HIT]: 0x02 }), true, false);
    expect(writes).toEqual([[OBJECTIVE_LATCH_AT, 1], [OBJECTIVE_GATE_AT, 1]]);
    expect(logs).toEqual(['[Objectives] 1/2 (need 1)', '[Objectives] bucket open']);
  });

  it('keeps the latch after the flag clears', () => {
    const { logs, watch } = setup(2);
    watch.observe(fakeView({ [OBJECTIVE_LATCH_AT]: 1 }), true, false);
    expect(logs).toEqual(['[Objectives] 1/2 (need 2)']);
  });

  it('latches a settle flag only after the location changes', () => {
    const { writes, watch } = setup(2);
    watch.observe(fakeView({ 0x0100: 5, [SETTLED]: 0x04 }), true, false);
    expect(writes).toEqual([]);
    watch.observe(fakeView({ 0x0100: 6, [SETTLED]: 0x04 }), true, false);
    expect(writes).toEqual([[OBJECTIVE_LATCH_AT, 2]]);
  });

  it('waits for the game start', () => {
    const { writes, watch } = setup(1);
    watch.observe(fakeView({ [HIT]: 0x02 }), false, false);
    expect(writes).toEqual([]);
  });

  it('is part of the mode hooks only with the bucket list on', () => {
    const writes: number[] = [];
    const write = (offset: number): boolean => writes.push(offset) > 0;
    const view = fakeView({ [HIT]: 0xff, [SETTLED]: 0xff });
    createModeHooks({}, write, { seed: 'seed', party: ['crono'] }).observe(view, true, false);
    expect(writes).toEqual([]);
    createModeHooks({ bucketList: true, objectiveCount: 8 }, write, { seed: 'seed', party: ['crono'] }).observe(view, true, false);
    expect(writes.length).toBeGreaterThan(0);
  });
});
