/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { peek, recipeState, requireTools, rgbOfFb } from './ctgen/require-tools';
import { hx } from './ctgen/text-file';
import { renderPlacards } from './ow-era-placard-text';
import type { Placard } from './ow-era-placard-text';

/** [name, era id, world] — the world is null for the two recipe states. */
const SOURCES: [string, number, number | null][] = [
  ['saves/ow_w0.state', 0x75, null],
  ['saves/com_jogo_salvo.state', 0x76, null],
  ['saves/ow_w3.live', 0x78, 3],
  ['saves/ow_w4.live', 0x79, 4],
  ['saves/ow_w7.live', 0x7a, 7],
  ['saves/ow_w1.live', 0x7b, 1],
];
/** The object's own Y, and every shipped piece has dY = 0. */
const PLACARD_Y = 192;
/** The oracle fb puts SNES scanline 0 at image row 8. */
const ROW0 = PLACARD_Y + 8;

type Piece = [number, number];

/** The isolated layer's backdrop (its modal colour, first seen on a tie) as the transparent key. */
const modalColour = (img: Uint8Array): string => {
  const counts = new Map<string, number>();
  for (let i = 0; i < img.length; i += 3) {
    const k = `${img[i]},${img[i + 1]},${img[i + 2]}`;
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  let best = '';
  let n = -1;
  for (const [k, v] of counts) {
    if (v > n) [best, n] = [k, v];
  }
  return best;
};

/** The composed placard straight off the screen; an OAM x >= 128 is the PPU's wrap of a negative x. */
const strip = (img: Uint8Array, pieces: Piece[], key: string): { x0: number; w: number; px: Uint8Array } => {
  const xs = pieces.map(([x]) => (x >= 128 ? x - 256 : x));
  const x0 = Math.max(0, Math.min(...xs));
  const w = Math.max(...xs) + 16 - x0;
  const px = new Uint8Array(w * 16 * 4);
  for (let ty = 0; ty < 16; ty += 1) {
    for (let tx = 0; tx < w; tx += 1) {
      const sx = x0 + tx;
      if (sx < 0 || sx >= 256) continue;
      const o = ((ROW0 + ty) * 256 + sx) * 3;
      const i = (ty * w + tx) * 4;
      px[i] = img[o] as number;
      px[i + 1] = img[o + 1] as number;
      px[i + 2] = img[o + 2] as number;
      px[i + 3] = `${img[o]},${img[o + 1]},${img[o + 2]}` === key ? 0 : 255;
    }
  }
  return { x0, w, px };
};

const peekIso = async (ctx: ImportContext, state: Uint8Array): Promise<{ img: Uint8Array; pieces: Piece[]; key: string }> => {
  const out = await peek(ctx, state, '0:240', { rule: false, env: { PEEK_ISOBG: '4' } });
  const img = rgbOfFb(out.fb);
  const pieces: Piece[] = [];
  for (let i = 0; i < 128; i += 1) {
    if (out.oam[i * 4 + 1] === PLACARD_Y && out.oam[i * 4 + 3] === 0x31) {
      pieces.push([out.oam[i * 4] as number, (out.oam[i * 4 + 2] as number) | (((out.oam[i * 4 + 3] as number) & 1) << 8)]);
    }
  }
  return { img, pieces, key: modalColour(img) };
};

/** tools/gen/ow_era_placard.py: the overworld era placard's pixels per era id, from the oracle's isolated OBJ layer. */
const genOwEraPlacard = async (ctx: ImportContext): Promise<string> => {
  const w0 = await recipeState(ctx, 'ow_nav_w0');
  const states = new Map<number, Uint8Array>([
    [0x75, w0],
    [0x76, await recipeState(ctx, 'com_jogo_salvo')],
  ]);
  for (const [, era, world] of SOURCES) {
    if (world !== null) states.set(era, await requireTools(ctx).owforce(w0, world));
  }
  const eras: Placard[] = [];
  for (const [name, era] of SOURCES) {
    const { img, pieces, key } = await peekIso(ctx, states.get(era) as Uint8Array);
    if (pieces.length === 0) throw new Error(`ow_era_placard: no placard on screen in ${name}`);
    const { x0, w, px } = strip(img, pieces, key);
    const shape = pieces.map(([x, t]) => `${hx(t, 3)}@${x}`).join(' ');
    eras.push({ era, x0, w, px, seenIn: name, shape });
  }
  return renderPlacards(eras.sort((a, b) => a.era - b.era));
};

export { genOwEraPlacard };
