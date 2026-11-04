/* @layer bridge-wasm @kind logic */
import { worldGameFromDef } from '@drizztdourden08/brock-randomizer/world';
import type { DefTypes, RandomizerWorldGame } from '@drizztdourden08/brock-randomizer/world';
import { createCtWorldDef } from './create-ct-world-def';
import type { CtWorldInput } from './ct-world-input.type';
import type { CtWorldKeys } from './ct-world-keys.type';

const createCtWorldGame = (input: CtWorldInput): RandomizerWorldGame<DefTypes<CtWorldKeys>> =>
  worldGameFromDef(createCtWorldDef(input));

export { createCtWorldGame };
