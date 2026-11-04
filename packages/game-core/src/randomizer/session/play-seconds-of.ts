/* @layer bridge-wasm @kind logic */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/session';
import {
  CLOCK_BASE, CLOCK_HOUR_ONES, CLOCK_HOUR_TENS, CLOCK_MINUTE_ONES, CLOCK_MINUTE_TENS, CLOCK_SECONDS,
} from '../../game-info/wram-map.constants';
import { CT_WRAM_REGION } from '../memory/ct-memory.constants';

const playSecondsOf = (view: MemoryView): number => {
  const digit = (offset: number): number => view.byte(CT_WRAM_REGION, CLOCK_BASE + offset);
  const hours = digit(CLOCK_HOUR_TENS) * 10 + digit(CLOCK_HOUR_ONES);
  const minutes = digit(CLOCK_MINUTE_TENS) * 10 + digit(CLOCK_MINUTE_ONES);
  return (hours * 60 + minutes) * 60 + digit(CLOCK_SECONDS);
};

export { playSecondsOf };
