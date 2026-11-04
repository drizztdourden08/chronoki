/* @layer bridge-wasm @kind logic */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/session';
import { CT_WRAM_REGION } from '../memory/ct-memory.constants';
import { SAFE_FRAME_BUSY_BYTES } from './safe-frame.constants';

const isCtSafeFrame = (view: MemoryView | null): boolean =>
  view !== null && SAFE_FRAME_BUSY_BYTES.every((offset) => view.byte(CT_WRAM_REGION, offset) === 0);

export { isCtSafeFrame };
