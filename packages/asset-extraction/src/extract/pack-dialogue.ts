/* @layer shared-asset-extraction @kind logic */
import { T_DIALOGUE } from './asset-types.constants';
import { scanDialogueTables } from './dialogue-scan';
import { strList } from './str-list';
import { loadDict } from './text-tokens';
import type { Packer } from './extract.type';

const packDialogue: Packer = ({ rom }) => {
  const subs = loadDict(rom);
  const tables = scanDialogueTables(rom, subs, { pb: '\f', namesub: true, ind: '\x02'.repeat(3) });
  return [...tables.entries()].sort((a, b) => a[0] - b[0]).map(([addr, strs]) => ({ type: T_DIALOGUE, id: addr, blob: strList(strs) }));
};

export { packDialogue };
