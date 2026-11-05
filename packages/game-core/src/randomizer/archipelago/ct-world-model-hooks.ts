/* @layer bridge-wasm @kind logic */
import type { ItemClass, WorldModelHooks } from '@drizztdourden08/brock-randomizer/archipelago';
import type { HelperRegistry, RuleOptionValue, World } from '@drizztdourden08/brock-randomizer/world';
import { CT_HELPERS } from '../world/ct-helpers.constants';
import { CT_OPTION_CATALOG } from '../world/ct-options.constants';
import { TREASURE_ITEM_PREFIX } from '../world/ct-key-items.constants';
import type { CtWorldKeys } from '../world/ct-world-keys.type';
import { CT_HELPER_ITEMS } from './ct-world-model-hooks.constants';

const helpers: HelperRegistry<World<CtWorldKeys>> = new Map(CT_HELPERS.map((helper) => [helper.name, helper]));

const readingsOf = (world: World<CtWorldKeys>): Record<string, RuleOptionValue> =>
  Object.fromEntries(CT_OPTION_CATALOG
    .filter((option) => option.implemented)
    .map((option) => [option.key, world.readOption(option.key)]));

const classOf = (item: string): ItemClass => (item.startsWith(TREASURE_ITEM_PREFIX) ? 'filler' : 'progression');

const ctWorldModelHooks: WorldModelHooks<CtWorldKeys> = {
  helpers,
  readings: readingsOf,
  primitives: () => ({}),
  primitiveItems: (helper) => CT_HELPER_ITEMS[helper] ?? [],
  classify: classOf,
};

export { ctWorldModelHooks };
