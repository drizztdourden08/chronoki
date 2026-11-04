/* @layer shared-asset-extraction @kind logic */
import { u16 } from '../extract/rom-read';
import { ptr24 } from './closure-locations';
import { C2, C6, WORLD_PACKET_TABLES, GAUGE_PACKETS } from './closure-world.constants';

const worldStreams = (rom: Uint8Array): Map<string, Set<number>> => {
  const packets = new Set<number>();
  for (let k = 0; k + 1 < WORLD_PACKET_TABLES.length; k += 1) {
    const a = WORLD_PACKET_TABLES[k] as number;
    const b = WORLD_PACKET_TABLES[k + 1] as number;
    for (let e = C6 + a; e < C6 + b - 2; e += 3) {
      const o = ptr24(rom, e);
      if (o !== null) packets.add(o);
    }
  }
  const gauge = new Set(GAUGE_PACKETS.map(([i, bank]) => ((bank - 0xc0) << 16) | u16(rom, C2 + 0x7220 + 4 * i)));
  return new Map([
    ['world packets ($C6:FDF0-FFFF tables)', packets],
    ['time gauge packets (C2:7220)', gauge],
  ]);
};

export { worldStreams };
