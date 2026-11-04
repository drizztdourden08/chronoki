/* @layer shared-asset-extraction @kind logic */
import { wordAt } from '../bytes/word-at';

const wordTable = (rom: Uint8Array, at: number, bank: number): [number[], number] => {
  const ts: number[] = [];
  let o = at;
  while (o < bank + Math.min(...ts, 0x10000) && o + 1 < rom.length) {
    ts.push(wordAt(rom, o));
    o += 2;
  }
  return [ts, o];
};

export { wordTable };
