/* @layer shared-asset-extraction @kind logic */
import type { Rgb3 } from './battle-hud-strip.type';
import { STRIP_H } from './battle-hud-strip.constants';

const bg1Palette = (...texes: Rgb3[][][]): Rgb3[] => {
  const cols = new Map<string, Rgb3>();
  for (const tex of texes) {
    for (let ry = 0; ry < STRIP_H; ry += 1) {
      for (const c of tex[ry] as Rgb3[]) cols.set(c.join(','), c);
    }
  }
  const sum = (c: Rgb3): number => c[0] + c[1] + c[2];
  const pal = [...cols.values()].sort((a, b) => sum(a) - sum(b) || a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);
  if (pal.length > 255) throw new Error(`chrome palette too large for a uint8 index (${pal.length})`);
  return pal;
};

export { bg1Palette };
