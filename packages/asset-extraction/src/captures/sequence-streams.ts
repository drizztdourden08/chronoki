/* @layer shared-asset-extraction @kind logic */
import { u16 } from '../extract/rom-read';
import { SEQ_TABLE } from './closure-locations.constants';
import { ptr24 } from './closure-locations';

const sequenceStreams = (rom: Uint8Array): Map<string, Set<number>> => {
  let first = Infinity;
  for (let x = 0; x < 0x100; x += 3) {
    if (rom[SEQ_TABLE + x + 2] === 0xfe) first = Math.min(first, u16(rom, SEQ_TABLE + x));
  }
  const offs = new Set<number>();
  for (let x = 0; x < first - 2; x += 3) {
    const o = ptr24(rom, SEQ_TABLE + x);
    if (o !== null) offs.add(o);
  }
  return new Map([['sequence packets ($FE:0000 table)', offs]]);
};

export { sequenceStreams };
