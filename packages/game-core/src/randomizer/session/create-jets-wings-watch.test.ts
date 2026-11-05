/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { INVENTORY_COUNTS, INVENTORY_IDS } from '../../game-info/wram-map.constants';
import { createJetsWingsWatch } from './create-jets-wings-watch';
import { createModeHooks } from './create-mode-hooks';
import { fakeView } from './memory-view.fake';

const writes: [number, number][] = [];
const write = (offset: number, bytes: Uint8Array): boolean => {
  writes.push([offset, bytes[0] ?? 0]);
  return true;
};

const withJets = { [INVENTORY_IDS]: 0xea, [INVENTORY_COUNTS]: 1 };
const inside = { 0x0100: 0x1b7, ...withJets };
const overworld = { 0x0100: 0x1f1, ...withJets };

describe('createJetsWingsWatch', { tags: ['critical'] }, () => {
  it('gives the Epoch its wings once when the Jets are carried off the overworld', () => {
    writes.length = 0;
    const watch = createJetsWingsWatch(write);
    watch.observe(fakeView(inside), true, false);
    watch.observe(fakeView(inside), true, false);
    expect(writes).toEqual([[0x0294, 0x20], [0x027e, 2], [0x028f, 2]]);
  });

  it('waits for the Jets, the game start and the field', () => {
    writes.length = 0;
    const watch = createJetsWingsWatch(write);
    watch.observe(fakeView({ 0x0100: 0x1b7 }), true, false);
    watch.observe(fakeView(inside), false, false);
    watch.observe(fakeView(overworld), true, false);
    expect(writes).toEqual([]);
    watch.reset();
    watch.observe(fakeView(inside), true, false);
    expect(writes).toHaveLength(3);
  });

  it('is part of the mode hooks only with Epoch Fail on, outside Lost Worlds', () => {
    writes.length = 0;
    createModeHooks({}, write).observe(fakeView(inside), true, false);
    createModeHooks({ epochFail: true, gameMode: 'lost-worlds' }, write).observe(fakeView(inside), true, false);
    expect(writes).toEqual([]);
    createModeHooks({ epochFail: true }, write).observe(fakeView(inside), true, false);
    expect(writes).toHaveLength(3);
  });
});
