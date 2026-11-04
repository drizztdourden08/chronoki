/* @layer shared-asset-extraction @kind logic */
import { romRegion } from '../rom/hirom';
import { hex } from './c-hex';
import { hexByte } from './c-hex-byte';
import { BASE, NLIST, PAIRS_AT, HEADER } from './menu-wingrad.constants';

const readLists = (rom: Uint8Array): { lists: Uint8Array[]; addrs: number[] } => {
  const lists: Uint8Array[] = [];
  const addrs: number[] = [];
  let off = BASE;
  for (let i = 0; i < NLIST; i += 1) {
    const n = rom[off] as number;
    addrs.push(off + 1 - 0x3f0000);
    lists.push(romRegion(rom, off + 1, off + 1 + n));
    off += 1 + n;
  }
  return { lists, addrs };
};

const checkPairs = (rom: Uint8Array): void => {
  const pairs = romRegion(rom, PAIRS_AT, PAIRS_AT + 0x20);
  for (let k = 0; k < 16; k += 1) {
    const cgadsub = pairs[k * 2] as number;
    const coldata = pairs[k * 2 + 1] as number;
    if ((coldata & 0xe0) !== 0xe0) throw new Error('COLDATA must select all three channels');
    const got = (coldata & 0x1f) * (cgadsub & 0x80 ? -1 : 1);
    if (got !== 8 - k) throw new Error(`window-gradient pair ${k} decodes to ${got}, want ${8 - k}`);
  }
};

const describeList = (l: Uint8Array): string => {
  const parts: string[] = [];
  for (let j = 0; j < l.length - 1; j += 2) parts.push(`${l[j] === 0 ? 'flat' : 'RAMP'}${l[j + 1]}`);
  return parts.join(' ');
};

const genMenuWingrad = (rom: Uint8Array): string => {
  const { lists, addrs } = readLists(rom);
  checkPairs(rom);
  const rows = lists.map((l, i) => {
    const body = Array.from(l, hexByte).join(',');
    const pad = ',0x80'.repeat(Math.max(0, 16 - l.length));
    return `  { ${body}${pad} },  // FF/${hex(addrs[i] as number, 4)}  ${describeList(l)}`;
  });
  return `${[...HEADER, ...rows, '};\n#endif'].join('\n')}\n`;
};

export { genMenuWingrad };
