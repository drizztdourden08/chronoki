/* @layer shared-asset-extraction @kind logic */
import { readStringList } from './read-string-list';

const locationNames = (rom: Uint8Array, subs: string[]): string[] => readStringList(rom, 0x6f400, 112, subs);

export { locationNames };
