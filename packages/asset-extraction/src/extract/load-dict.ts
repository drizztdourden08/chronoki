/* @layer shared-asset-extraction @kind logic */
import { DICT_COUNT, DICT_BASE } from './text-tokens.constants';
import { decodeTokens } from './decode-tokens';

const loadDict = (rom: Uint8Array): string[] => {
  const subs: string[] = [];
  for (let i = 0; i < DICT_COUNT; i += 1) {
    const p = (rom[DICT_BASE + i * 2]! | (rom[DICT_BASE + i * 2 + 1]! << 8)) - 0xfa00;
    const o = DICT_BASE + p;
    subs.push(decodeTokens(rom, o + 1, [], rom[o]!));
  }
  return subs;
};

export { loadDict };
