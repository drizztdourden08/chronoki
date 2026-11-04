/* @layer shared-asset-extraction @kind logic */
import { readStringList } from './read-string-list';

const worldNames = (rom: Uint8Array, subs: string[]): string[] => readStringList(rom, 0x6f4d4, 6, subs);

export { worldNames };
