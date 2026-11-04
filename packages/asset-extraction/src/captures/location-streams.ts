/* @layer shared-asset-extraction @kind logic */
import { MAP_PTRS, ASM_PTRS, ASM3_PTRS, TS_PTRS, SCRIPT_PTRS } from './closure-locations.constants';
import { streamsOf } from './streams-of';
import { locationIndices } from './location-indices';

const locationStreams = (rom: Uint8Array): Map<string, Set<number>> => {
  const { ts, b3s, idxs, maps, scripts } = locationIndices(rom);
  return new Map([
    ['location maps', streamsOf(rom, MAP_PTRS, maps)],
    ['location tilesets', streamsOf(rom, TS_PTRS, new Set([...idxs, ...b3s]))],
    ['location assemblies', streamsOf(rom, ASM_PTRS, ts)],
    ['location BG3 assemblies', streamsOf(rom, ASM3_PTRS, b3s)],
    ['location scripts', streamsOf(rom, SCRIPT_PTRS, scripts)],
  ]);
};

export { locationStreams };
