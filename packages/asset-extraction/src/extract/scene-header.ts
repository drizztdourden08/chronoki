/* @layer shared-asset-extraction @kind logic @source Python extract_assets._hdr, extract_assets._distinct */
import { SCENE_HDR } from './asset-types.constants';

const sceneHeader = (rom: Uint8Array, s: number): Uint8Array => rom.slice(SCENE_HDR + s * 14, SCENE_HDR + s * 14 + 14);

const distinctHeaderBytes = (rom: Uint8Array, byteIndex: number, exclude: number[] = [0xff]): number[] => {
  const seen = new Set<number>();
  for (let s = 0; s < 512; s += 1) seen.add(sceneHeader(rom, s)[byteIndex]!);
  return [...seen].filter((v) => !exclude.includes(v)).sort((a, b) => a - b);
};

export { distinctHeaderBytes, sceneHeader };
