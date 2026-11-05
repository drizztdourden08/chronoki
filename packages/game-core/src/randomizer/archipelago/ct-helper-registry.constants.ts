/* @layer bridge-wasm @kind constants */
import type { KitHelperRegistry } from '@drizztdourden08/brock-randomizer/world';
import { CT_HELPERS } from '../world/ct-helpers.constants';
import type { CtWorldKeys } from '../world/ct-world-keys.type';

const CT_HELPER_REGISTRY: KitHelperRegistry<CtWorldKeys> = new Map(CT_HELPERS.map((helper) => [helper.name, helper]));

export { CT_HELPER_REGISTRY };
