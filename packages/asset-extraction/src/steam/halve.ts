/* @layer shared-asset-extraction @kind logic */
import type { Rgba } from './steam-image.type';

const halve = ({ w, h, px }: Rgba): Rgba => {
  const out: number[] = [];
  for (let y = 0; y < h - 1; y += 2) {
    for (let x = 0; x < w - 1; x += 2) {
      const opaque: string[] = [];
      for (const j of [0, 1]) {
        for (const i of [0, 1]) {
          const o = 4 * ((y + j) * w + x + i);
          if ((px[o + 3] as number) >= 128) opaque.push(Array.from(px.subarray(o, o + 4)).join(','));
        }
      }
      if (opaque.length < 2) out.push(0, 0, 0, 0);
      else {
        let best = opaque[0] as string;
        for (const c of opaque) if (opaque.filter((q) => q === c).length > opaque.filter((q) => q === best).length) best = c;
        out.push(...best.split(',').slice(0, 3).map(Number), 255);
      }
    }
  }
  return { w: Math.floor(w / 2), h: Math.floor(h / 2), px: Uint8Array.from(out) };
};

export { halve };
