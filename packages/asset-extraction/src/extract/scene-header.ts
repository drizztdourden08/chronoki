/* @layer shared-asset-extraction @kind logic */
import { SCENE_HDR } from './asset-types.constants';

/** extract_assets._hdr: scene `s`'s 14 header bytes. */
const sceneHeader = (rom: Uint8Array, s: number): Uint8Array => rom.slice(SCENE_HDR + s * 14, SCENE_HDR + s * 14 + 14);

/** extract_assets._distinct: the sorted distinct values of header byte `byteIndex` over the 512 scenes, minus `exclude`. */
const distinctHeaderBytes = (rom: Uint8Array, byteIndex: number, exclude: number[] = [0xff]): number[] => {
  const seen = new Set<number>();
  for (let s = 0; s < 512; s += 1) seen.add(sceneHeader(rom, s)[byteIndex]!);
  return [...seen].filter((v) => !exclude.includes(v)).sort((a, b) => a - b);
};

export { distinctHeaderBytes, sceneHeader };
