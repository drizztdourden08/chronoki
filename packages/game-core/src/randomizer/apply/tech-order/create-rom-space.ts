/* @layer bridge-wasm @kind logic */
import { CTAS_TYPE_TABLE } from '../../checks/checks.constants';
import { readPackEntries } from '../../checks/read-pack-entries';
import { namedTableOf } from './named-table-of';
import { CC_MENU_TABLE_NAME, CC_MENU_TABLE_ROM } from './tech-order.constants';
import type { RomSpace } from './tech-order.type';

type Region = { rom: number; start: number; length: number };

const createRomSpace = (pack: Uint8Array): RomSpace => {
  const menuCopy = namedTableOf(pack, CC_MENU_TABLE_NAME);
  const regions: Region[] = [
    ...readPackEntries(pack).filter((e) => e.type === CTAS_TYPE_TABLE).map((e) => ({ rom: e.id, start: e.start, length: e.length })),
    ...(menuCopy === null ? [] : [{ rom: CC_MENU_TABLE_ROM, start: menuCopy.at, length: menuCopy.size }]),
  ];
  const locate = (addr: number): number[] =>
    regions.filter((r) => addr >= r.rom && addr < r.rom + r.length).map((r) => r.start + addr - r.rom);
  const read = (addr: number): number | undefined => {
    const at = locate(addr)[0];
    return at === undefined ? undefined : pack[at];
  };
  return { read, locate };
};

export { createRomSpace };
