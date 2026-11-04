/* @layer shared-asset-extraction @kind logic */
import { sceneHeader } from './scene-header';

const distinctHeaderBytes = (rom: Uint8Array, byteIndex: number, exclude: number[] = [0xff]): number[] => {
  const seen = new Set<number>();
  for (let s = 0; s < 512; s += 1) seen.add(sceneHeader(rom, s)[byteIndex] as number);
  return [...seen].filter((v) => !exclude.includes(v)).sort((a, b) => a - b);
};

export { distinctHeaderBytes };
