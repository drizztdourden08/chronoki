/* @layer shared-asset-extraction @kind logic */
import { createLeWriter } from '../buffer/le-writer';
import type { Margin } from './steam-margins';
import type { Rgba } from './steam-image';

type ResolvedMargin = Omit<Margin, 'pages'> & { pages: [number, number][] };

interface CtWide {
  margins: Map<number, ResolvedMargin>;
  sets: Map<number, Uint8Array>;
  sheets: Uint8Array[];
  specials: (Rgba & { name: string })[];
  palettes: Map<number, Uint8Array>;
}

const byKey = <T>(m: Map<number, T>): [number, T][] => [...m.entries()].sort((a, b) => a[0] - b[0]);

const writeCtWide = ({ margins, sets, sheets, specials, palettes }: CtWide): Uint8Array => {
  const o = createLeWriter();
  o.bytes(new TextEncoder().encode('CTWD'));
  for (const v of [3, margins.size, sets.size, sheets.length]) o.u32(v);
  for (const [s, px] of byKey(sets)) {
    o.u8(s);
    o.bytes(px);
  }
  for (const px of sheets) o.bytes(px);
  for (const [loc, m] of byKey(margins)) {
    o.u16(loc);
    o.u8(m.w);
    o.u8(m.h);
    o.bytes(m.planes);
    o.bytes(Uint8Array.from(m.slots.map((s) => (sets.has(s) ? s : 0xff))));
    o.u16(m.metas.length);
    for (const { t, corners } of m.metas) {
      o.u16(t);
      for (const [c, p, fl] of corners) {
        o.u16(c);
        o.u8(p);
        o.u8(fl);
      }
    }
    o.u8(m.pages.length);
    for (const [pg, s] of m.pages) {
      o.u8(pg);
      o.u16(s);
    }
  }
  o.bytes(new TextEncoder().encode('SPCL'));
  o.u32(specials.length);
  for (const { name, w, h, px } of specials) {
    const nameBytes = new TextEncoder().encode(name);
    o.u8(nameBytes.length);
    o.bytes(nameBytes);
    o.u16(w);
    o.u16(h);
    o.bytes(px);
  }
  o.bytes(new TextEncoder().encode('PALS'));
  o.u32(palettes.size);
  for (const [loc, pal] of byKey(palettes)) {
    o.u16(loc);
    o.bytes(pal);
  }
  return o.toBytes();
};

export { writeCtWide };
export type { CtWide, ResolvedMargin };
