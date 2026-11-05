/* @layer bridge-wasm @kind logic */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/memory';
import { SHEET_COUNT } from '../../game-info/wram-map.constants';
import type { TabAmounts } from '../world/tabs/tab-amounts.type';
import { boostTabStat } from './boost-tab-stat';
import type { ModeHook } from './mode-hook.type';
import { readTabSnapshot } from './read-tab-snapshot';
import type { WramWrite } from './start-gold-grant.type';
import { TAB_STAT_SLOTS, TAB_USE_WINDOW_POLLS } from './tab-amount-watch.constants';
import type { TabSnapshot } from './tab-stat-slot.type';

const countdown = (value: number): number => Math.max(0, value - 1);

const createTabAmountWatch = (write: WramWrite, amounts: TabAmounts): ModeHook => {
  let last: TabSnapshot | null = null;
  let drops = TAB_STAT_SLOTS.map(() => 0);
  let rises = TAB_STAT_SLOTS.map(() => Array.from({ length: SHEET_COUNT }, () => 0));
  const reset = (): void => {
    last = null;
    drops = TAB_STAT_SLOTS.map(() => 0);
    rises = TAB_STAT_SLOTS.map(() => Array.from({ length: SHEET_COUNT }, () => 0));
  };
  const mark = (now: TabSnapshot, before: TabSnapshot): void => {
    TAB_STAT_SLOTS.forEach((slot, i) => {
      drops[i] = (now.counts.get(slot.id) ?? 0) < (before.counts.get(slot.id) ?? 0) ? TAB_USE_WINDOW_POLLS : countdown(drops[i] ?? 0);
      rises[i] = (now.stats[i] ?? []).map((value, sheet) =>
        value === ((before.stats[i] ?? [])[sheet] ?? value) + 1 ? TAB_USE_WINDOW_POLLS : countdown((rises[i] ?? [])[sheet] ?? 0));
    });
  };
  const settle = (view: MemoryView, now: TabSnapshot): void => {
    TAB_STAT_SLOTS.forEach((slot, i) => {
      const extra = amounts[slot.kind] - 1;
      const sheet = (rises[i] ?? []).findIndex((left) => left > 0);
      if (extra <= 0 || (drops[i] ?? 0) === 0 || sheet < 0) return;
      const boosted = boostTabStat({ view, write, slot, sheet, extra });
      if (boosted === null) return;
      drops[i] = 0;
      (rises[i] ?? [])[sheet] = 0;
      (now.stats[i] as number[])[sheet] = boosted;
    });
  };
  return {
    observe: (view, started) => {
      if (!started) return;
      const now = readTabSnapshot(view);
      if (last !== null) {
        mark(now, last);
        settle(view, now);
      }
      last = now;
    },
    goalReached: () => false,
    reset,
  };
};

export { createTabAmountWatch };
