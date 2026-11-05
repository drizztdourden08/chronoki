/* @layer bridge-wasm @kind type */
import type { CollectionState, World } from '@drizztdourden08/brock-randomizer/world';
import type { CtWorldKeys } from './ct-world-keys.type';

type CtGoal = (state: CollectionState<World<CtWorldKeys>>) => boolean;

export type { CtGoal };
