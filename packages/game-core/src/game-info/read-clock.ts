/* @layer bridge-wasm @kind logic */
import {
  CLOCK_BASE, CLOCK_CAP_FLAG, CLOCK_FROZEN_FLAG, CLOCK_HOUR_ONES, CLOCK_HOUR_TENS, CLOCK_MAX_HOURS,
  CLOCK_MAX_MINUTES, CLOCK_MINUTE_ONES, CLOCK_MINUTE_TENS, CLOCK_SECONDS,
} from './wram-map.constants';
import { byteAt } from './read-bytes';
import type { GameInfoClock } from './game-info.type';

const readClock = (heap: Uint8Array, ptr: number): GameInfoClock => {
  const at = ptr + CLOCK_BASE;
  const hours = byteAt(heap, at + CLOCK_HOUR_TENS) * 10 + byteAt(heap, at + CLOCK_HOUR_ONES);
  const minutes = byteAt(heap, at + CLOCK_MINUTE_TENS) * 10 + byteAt(heap, at + CLOCK_MINUTE_ONES);
  const capped = byteAt(heap, ptr + CLOCK_CAP_FLAG) !== 0 || hours > CLOCK_MAX_HOURS;
  return {
    hours: capped ? CLOCK_MAX_HOURS : hours,
    minutes: capped ? CLOCK_MAX_MINUTES : Math.min(minutes, CLOCK_MAX_MINUTES),
    seconds: capped ? CLOCK_MAX_MINUTES : Math.min(byteAt(heap, at + CLOCK_SECONDS), CLOCK_MAX_MINUTES),
    capped,
    frozen: byteAt(heap, ptr + CLOCK_FROZEN_FLAG) !== 0,
  };
};

export { readClock };
