/* @layer bridge-wasm @kind constants */
import type { RandomizerGameMode } from '@drizztdourden08/brock-randomizer';
import { isExperimental } from '../../../shell/show-rules/is-experimental';

const CHRONOKI_MODES: readonly RandomizerGameMode[] = [
  { id: 'online', label: 'Archipelago', rank: 100, when: isExperimental },
  { id: 'archipelia', label: 'Archipelia', rank: 200 },
];

export { CHRONOKI_MODES };
