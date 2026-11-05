/* @layer bridge-wasm @kind logic */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/memory';
import { CT_WRAM_REGION } from '../memory/ct-memory.constants';
import type { ObjectiveSource } from '../world/bucket/objective-def.type';
import { objectiveBitCount } from './objective-bit-count';
import { objectiveDoneNow } from './objective-done-now';
import { locationOf } from './objective-location-of';
import { GATE_OPEN, OBJECTIVE_GATE_AT, OBJECTIVE_LATCH_AT, OBJECTIVE_LOG_TAG } from './objective-watch.constants';
import type { ModeHook } from './mode-hook.type';
import type { WramWrite } from './start-gold-grant.type';

const createObjectiveWatch = (
  write: WramWrite,
  sources: readonly ObjectiveSource[],
  needed: number,
  log: (line: string) => void = () => undefined,
): ModeHook => {
  let seenAt = new Map<number, number>();
  let reported = -1;
  let opened = false;
  let wasStarted = false;

  const doneAt = (index: number, source: ObjectiveSource, view: MemoryView): boolean => {
    if (!objectiveDoneNow(source, view)) {
      seenAt.delete(index);
      return false;
    }
    if (source.type !== 'flag' || !source.settle) return true;
    const first = seenAt.get(index) ?? locationOf(view);
    seenAt.set(index, first);
    return locationOf(view) !== first;
  };

  return {
    observe: (view, started) => {
      const justStarted = started && !wasStarted;
      wasStarted = started;
      if (justStarted) {
        seenAt = new Map();
        reported = -1;
        opened = false;
      }
      if (!started) return;
      const latched = view.byte(CT_WRAM_REGION, OBJECTIVE_LATCH_AT);
      const merged = sources.reduce((bits, source, index) => (doneAt(index, source, view) ? bits | (1 << index) : bits), latched);
      if (merged !== latched) write(OBJECTIVE_LATCH_AT, Uint8Array.of(merged));
      const done = objectiveBitCount(merged);
      if (done !== reported) log(`${OBJECTIVE_LOG_TAG} ${done}/${sources.length} (need ${needed})`);
      reported = done;
      if (done < needed) return;
      if (view.byte(CT_WRAM_REGION, OBJECTIVE_GATE_AT) !== GATE_OPEN) write(OBJECTIVE_GATE_AT, Uint8Array.of(GATE_OPEN));
      if (!opened) log(`${OBJECTIVE_LOG_TAG} bucket open`);
      opened = true;
    },
    goalReached: () => false,
    reset: () => {
      wasStarted = false;
      seenAt = new Map();
      reported = -1;
      opened = false;
    },
  };
};

export { createObjectiveWatch };
