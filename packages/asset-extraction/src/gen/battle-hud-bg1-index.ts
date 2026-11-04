/* @layer shared-asset-extraction @kind logic */
import type { Rgb3 } from './battle-hud-strip.type';

const bg1Index = (tex: Rgb3[][], pal: Rgb3[]): number[][] => {
  const idx = new Map(pal.map((c, i) => [c.join(','), i]));
  return tex.map((row) => row.map((c) => idx.get(c.join(',')) as number));
};

export { bg1Index };
