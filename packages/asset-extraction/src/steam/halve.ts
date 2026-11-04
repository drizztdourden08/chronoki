/* @layer shared-asset-extraction @kind logic */
import type { Rgba } from './steam-image.type';

const opaqueColours = (px: Uint8Array, w: number, x: number, y: number): string[] => {
  const opaque: string[] = [];
  for (const j of [0, 1]) {
    for (const i of [0, 1]) {
      const o = 4 * ((y + j) * w + x + i);
      if ((px[o + 3] as number) >= 128) opaque.push(Array.from(px.subarray(o, o + 4)).join(','));
    }
  }
  return opaque;
};

const majority = (opaque: string[]): string => {
  let best = opaque[0] as string;
  for (const c of opaque) if (opaque.filter((q) => q === c).length > opaque.filter((q) => q === best).length) best = c;
  return best;
};

const halve = ({ w, h, px }: Rgba): Rgba => {
  const out: number[] = [];
  for (let y = 0; y < h - 1; y += 2) {
    for (let x = 0; x < w - 1; x += 2) {
      const opaque = opaqueColours(px, w, x, y);
      if (opaque.length < 2) out.push(0, 0, 0, 0);
      else out.push(...majority(opaque).split(',').slice(0, 3).map(Number), 255);
    }
  }
  return { w: Math.floor(w / 2), h: Math.floor(h / 2), px: Uint8Array.from(out) };
};

export { halve };
