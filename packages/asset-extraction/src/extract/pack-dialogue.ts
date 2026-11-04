/* @layer shared-asset-extraction @kind logic */
import { T_DIALOGUE } from './asset-types.constants';
import { scanDialogueTables } from './dialogue-scan';
import { strList } from './str-list';
import { loadDict } from './text-tokens';
import type { Packer } from './extract.type';

/**
 * extract_assets.pack_dialogue: one T_DIALOGUE per string table, ordered by address. pb '\f' marks the page breaks,
 * namesub emits the render-time name markers, ind '\x02' x3 keeps a break token's indent apart from literal spaces.
 */
const packDialogue: Packer = ({ rom }) => {
  const subs = loadDict(rom);
  const tables = scanDialogueTables(rom, subs, { pb: '\f', namesub: true, ind: '\x02'.repeat(3) });
  return [...tables.entries()].sort((a, b) => a[0] - b[0]).map(([addr, strs]) => ({ type: T_DIALOGUE, id: addr, blob: strList(strs) }));
};

export { packDialogue };
