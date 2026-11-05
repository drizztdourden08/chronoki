/* @layer bridge-wasm @kind logic */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/memory';
import { CT_WRAM_REGION } from '../memory/ct-memory.constants';
import { LOCATION_ID, LOCATION_MASK } from './jets-wings.constants';

const locationOf = (view: MemoryView): number => view.word(CT_WRAM_REGION, LOCATION_ID) & LOCATION_MASK;

export { locationOf };
