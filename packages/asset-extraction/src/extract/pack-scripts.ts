/* @layer shared-asset-extraction @kind logic @source Python extract_assets.pack_scripts */
import type { CtasEntry } from '../ctas/ctas.type';
import { T_SCRIPT } from './asset-types.constants';
import { lzDecompress } from './lz-decompress';
import { sceneHeader } from './scene-props';
import { scriptPointers } from './script/script-load';
import type { Packer } from './extract.type';

const packScripts: Packer = ({ rom }) => {
  const entries: CtasEntry[] = [];
  const ptrs = scriptPointers(rom);
  const seen = new Set<number>();
  for (let s = 0; s < 512; s += 1) {
    const h = sceneHeader(rom, s);
    const si = (h[8] as number) | ((h[9] as number) << 8);
    if (seen.has(si) || si >= ptrs.length || ptrs[si] === 0) continue;
    seen.add(si);
    try {
      entries.push({ type: T_SCRIPT, id: si, blob: lzDecompress(rom, ptrs[si] as number) });
    } catch {
      continue;
    }
  }
  return entries;
};

export { packScripts };
