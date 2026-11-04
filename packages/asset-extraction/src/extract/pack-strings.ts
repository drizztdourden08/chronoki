/* @layer shared-asset-extraction @kind logic */
import { S_DICT, S_ITEMS, S_LOCATIONS, S_WORLD, T_STRINGS } from './asset-types.constants';
import { strList } from './str-list';
import { itemNames, locationNames, worldNames } from './text-lists';
import { loadDict } from './text-tokens';
import type { Packer } from './extract.type';

/** extract_assets.pack_strings: the dictionary, item names, world names and location names. */
const packStrings: Packer = ({ rom }) => {
  const subs = loadDict(rom);
  return [
    { type: T_STRINGS, id: S_DICT, blob: strList(subs) },
    { type: T_STRINGS, id: S_ITEMS, blob: strList(itemNames(rom)) },
    { type: T_STRINGS, id: S_WORLD, blob: strList(worldNames(rom, subs)) },
    { type: T_STRINGS, id: S_LOCATIONS, blob: strList(locationNames(rom, subs)) },
  ];
};

export { packStrings };
