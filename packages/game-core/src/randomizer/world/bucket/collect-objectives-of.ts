/* @layer bridge-wasm @kind logic */
import { CT_KEY_ITEM_NAMES } from '../ct-key-items.constants';
import { CT_KEY_ITEM_ROM_IDS } from '../ct-key-item-rom-ids.constants';
import { CT_KIT } from '../ct-kit.constants';
import type { CtBaseKeyItem, CtKeyItem } from '../ct-world-keys.type';
import { COLLECT_EXCLUDED } from './collect-objectives.constants';
import type { ObjectiveDef } from './objective-def.type';

const { has } = CT_KIT;

const collectObjectivesOf = (keyItems: readonly CtKeyItem[]): ObjectiveDef[] =>
  keyItems
    .filter((item): item is CtBaseKeyItem => item in CT_KEY_ITEM_ROM_IDS)
    .filter((item) => !COLLECT_EXCLUDED.includes(item))
    .map(
    (item): ObjectiveDef => ({
      id: `collect-${item}`, label: `Collect ${CT_KEY_ITEM_NAMES[item]}`, kind: 'collect',
      source: { type: 'item', itemId: CT_KEY_ITEM_ROM_IDS[item] }, regions: [], items: [item], rule: has(item),
    }),
  );

export { collectObjectivesOf };
