/* @layer bridge-wasm @kind logic */
import type { LocationRequires } from '@drizztdourden08/brock-randomizer/archipelago';
import type { WorldLocation } from '@drizztdourden08/brock-randomizer/world';
import type { CtWorldKeys } from '../world/ct-world-keys.type';
import { ctEveryModeLocationKeys } from './ct-every-mode-location-keys';
import { ALWAYS_PRESENT, PRESENT_BY_MODE } from './ct-location-requires-of.constants';

const ctLocationRequiresOf = (location: WorldLocation<CtWorldKeys>): LocationRequires =>
  (ctEveryModeLocationKeys().has(String(location.key)) ? ALWAYS_PRESENT : PRESENT_BY_MODE);

export { ctLocationRequiresOf };
