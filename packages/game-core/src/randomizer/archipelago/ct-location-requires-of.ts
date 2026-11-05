/* @layer bridge-wasm @kind logic */
import type { LocationRequires } from '@drizztdourden08/brock-randomizer/archipelago';
import type { WorldLocation } from '@drizztdourden08/brock-randomizer/world';
import type { CtWorldKeys } from '../world/ct-world-keys.type';
import { ALWAYS_PRESENT } from './ct-location-requires-of.constants';

const ctLocationRequiresOf = (_location: WorldLocation<CtWorldKeys>): LocationRequires => ALWAYS_PRESENT;

export { ctLocationRequiresOf };
