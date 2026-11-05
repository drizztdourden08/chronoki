/* @layer bridge-wasm @kind constants */
import type { SchemaSet } from '@drizztdourden08/brock-randomizer/world';
import type { CtRegionId } from './ct-world-keys.type';

const CT_GAME = 'chronoki';
const CT_WORLD_SCHEMA = 'chronoki-world-v1';
const CT_PLACEMENT_SCHEMAS: SchemaSet = { current: 'chronoki-placement-v1' };
const CT_OPTION_SCHEMAS: SchemaSet = { current: 'chronoki-options-v1' };
const CT_UNSORTED: CtRegionId = 'unsorted';
const CT_LOCATION_KIND_SPOT = 'key-item-spot';
const CT_LOCATION_KIND_TREASURE = 'treasure';

export {
  CT_GAME, CT_LOCATION_KIND_SPOT, CT_LOCATION_KIND_TREASURE, CT_OPTION_SCHEMAS, CT_PLACEMENT_SCHEMAS,
  CT_UNSORTED, CT_WORLD_SCHEMA,
};
