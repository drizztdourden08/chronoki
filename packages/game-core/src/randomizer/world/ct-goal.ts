/* @layer bridge-wasm @kind logic */
import type { CollectionState, World } from '@drizztdourden08/brock-randomizer/world';
import type { CtWorldKeys } from './ct-world-keys.type';

const ctGoal = (state: CollectionState<World<CtWorldKeys>>): boolean => state.has('beat-lavos');

export { ctGoal };
