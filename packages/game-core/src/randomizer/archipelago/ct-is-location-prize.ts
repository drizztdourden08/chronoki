/* @layer bridge-wasm @kind logic */
import type { WorldLocation } from '@drizztdourden08/brock-randomizer/world';
import type { CtWorldKeys } from '../world/ct-world-keys.type';

const ctIsLocationPrize = (_location: WorldLocation<CtWorldKeys>): boolean => false;

export { ctIsLocationPrize };
