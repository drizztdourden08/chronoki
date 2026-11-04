/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { requireTools } from './ctgen/require-tools';
import { peek } from './ctgen/peek';
import { hx } from './ctgen/hx';
import { checkSeed } from './title-intro-seed';
import type { TitleCapture } from './title-intro.type';
import { SEED_FRAME, GFX_FRAME, SCRIPT_BASE, SCRIPT_END, PKG_BASE, PKG_END, VBASE, VWORDS } from './title-intro-capture.constants';

const refuse = (msg: string): Error => new Error(`title_intro: REFUSING: ${msg}`);
const u16 = (b: Uint8Array, a: number): number => (b[a] as number) | ((b[a + 1] as number) << 8);

const checkStatic = (a: Uint8Array, b: Uint8Array): void => {
  for (let i = 0; i < 0x10000; i += 2) {
    if (u16(a, i) !== u16(b, i) && !(i >= 0xe000 && i < 0xe080)) {
      throw refuse(
        `VRAM word $${hx(i / 2, 4)} changes during the logo phase ($${hx(u16(a, i), 4)} -> $${hx(u16(b, i), 4)}); the port bakes it as static.`,
      );
    }
  }
};

const mode7 = (words: number[]): Pick<TitleCapture, 'tmap' | 'chr8' | 'nt' | 'box'> => {
  const tmap = words.map((w) => w & 0xff);
  const chr8 = words.map((w) => w >> 8);
  const used = [...new Set(tmap)].filter((t) => t);
  if (used.length === 0) throw refuse('the mode-7 tilemap is empty -- the capture is not inside the sequence.');
  const nt = Math.max(...used) + 1;
  if (nt > 160) throw refuse(`tilemap references tile ${nt}, past the 160 tiles $7E:5E3C converts.`);
  const idx = [...Array(128).keys()];
  const rows = idx.filter((r) => idx.some((c) => tmap[r * 128 + c]));
  const cols = idx.filter((c) => idx.some((r) => tmap[r * 128 + c]));
  const [r0, r1, c0, c1] = [rows[0] as number, rows[rows.length - 1] as number, cols[0] as number, cols[cols.length - 1] as number];
  return { tmap, chr8, nt, box: { r0, c0, w: c1 - c0 + 1, h: r1 - r0 + 1 } };
};

const checkPackages = (seed: Uint8Array): number => {
  if (seed[SCRIPT_BASE] !== 0xfa || u16(seed, SCRIPT_BASE + 1) !== 0x3749) {
    throw refuse(`$7E:${hx(SCRIPT_BASE, 4)} does not open with \`FA 3749\` (add the script runner to the task list) -- this is not the title's script.`);
  }
  let p = PKG_BASE;
  let n = 0;
  while (p < PKG_END) {
    p += 1 + ((seed[p] as number) - 1) * 4;
    n += 1;
  }
  if (p !== PKG_END || n !== 11) {
    throw refuse(`the sprite packages do not tile $${hx(PKG_BASE, 4)}..$${hx(PKG_END, 4)} (ended at $${hx(p, 4)} after ${n}).`);
  }
  return n;
};

const checkWindow = (w: (a: number) => number): void => {
  const bg1 = Array.from({ length: 2048 }, (_, i) => w(0x6400 + i));
  const bg2 = Array.from({ length: 1024 }, (_, i) => w(0x6000 + i));
  if (!bg1.some((v) => v) || !bg2.some((v) => v)) throw refuse('a mode-2 tilemap is empty -- the graphics capture is not in the logo phase.');
  if (Math.max(...[...bg1, ...bg2].filter((e) => e).map((e) => e & 0x3ff)) * 16 + 0x5000 >= VBASE + VWORDS) {
    throw refuse('a mode-2 tilemap references character data past the captured window.');
  }
};

const captureTitle = async (ctx: ImportContext): Promise<TitleCapture> => {
  const tools = requireTools(ctx);
  const seedBoot = await tools.powerOn({ frames: SEED_FRAME, sram: null });
  const gfx = await tools.powerOn({ frames: GFX_FRAME, sram: null });
  const a = await peek(ctx, gfx.state, '0:200', { rule: false });
  const b = await peek(ctx, gfx.state, '0:600', { rule: false });
  checkStatic(a.vram, b.vram);
  const w = (addr: number): number => u16(a.vram, addr * 2);
  const m7 = mode7(Array.from({ length: 0x4000 }, (_, i) => w(i)));
  const seed = seedBoot.wram;
  const npkg = checkPackages(seed);
  const slidePkg = Array.from({ length: 5 }, (_, i) => u16(seed, 0x5d5d + i * 2));
  if (slidePkg.some((p) => !(p >= PKG_BASE && p < PKG_END))) {
    throw refuse(`a letter-slide entry ($7E:5D5D) does not point into the package region: ${slidePkg.map((p) => `0x${p.toString(16)}`).join(',')}`);
  }
  checkSeed(seed);
  checkWindow(w);
  const rom = ctx.rom.subarray(0xf900, 0xf900 + 1024);
  return { ...m7, w, seed, slidePkg, npkg, sin: rom, scriptBase: SCRIPT_BASE, scriptEnd: SCRIPT_END, pkgBase: PKG_BASE, pkgEnd: PKG_END, vbase: VBASE, vwords: VWORDS, seedFrame: SEED_FRAME };
};

export { captureTitle };
