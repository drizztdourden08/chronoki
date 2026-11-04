/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { requireTools } from './ctgen/require-tools';
import { peek } from './ctgen/peek';
import { cgramOf } from './ctgen/cgram-of';
import { recipeState } from './ctgen/recipe-state';
import { hx } from './ctgen/hx';
import type { LoaderCapture } from './menu-loader-capture.type';

const batteryOf = async (ctx: ImportContext): Promise<Uint8Array> => {
  const srm = (await recipeState(ctx, 'name_saved')).slice(-8192);
  if (srm.length !== 8192) throw new Error(`menu_loader: the battery is ${srm.length} bytes`);
  if ((((srm[0x1ff8] as number) | ((srm[0x1ff9] as number) << 8))) !== 0xe41b) {
    throw new Error(
      `menu_loader: the battery holds no game in slot 1 (signature ${hx(srm[0x1ff9] as number, 2)}${hx(srm[0x1ff8] as number, 2)}, expected E41B)`,
    );
  }
  return srm;
};

const refuse = (msg: string): Error => new Error(`REFUSING: ${msg}`);

const captureLoader = async (ctx: ImportContext): Promise<LoaderCapture> => {
  const boot = await requireTools(ctx).powerOn({ frames: 1, sram: await batteryOf(ctx) });
  const out = await peek(ctx, boot.state, '0:1600,8:6,0:150');
  const { vram, wram } = out;
  const word = (i: number): number => (vram[0x6000 * 2 + i * 2] as number) | ((vram[0x6000 * 2 + i * 2 + 1] as number) << 8);
  const cells = Array.from({ length: 32 * 64 }, (_, i) => word(i));
  const bad = [...new Set(cells.map((c) => c & 0x3ff))]
    .filter((t) => t !== 0 && !(t >= 0x300 && t < 0x3f0))
    .sort((a, b) => a - b);
  if (bad.length > 0) {
    throw refuse(`load screen uses chrome tiles outside the baked 0x300..0x3EF set: ${bad.map((t) => hx(t, 3)).join(' ')}`);
  }
  const bands: [number, number][] = [];
  for (let o = 0x9080; wram[o]; o += 3) bands.push([wram[o] as number, (wram[o + 1] as number) | ((wram[o + 2] as number) << 8)]);
  if (bands.map(([c]) => c).join() !== [40, 96, 80].join()) {
    throw refuse(
      `BG2VOFS HDMA line counts are [${bands.map(([c]) => c).join(', ')}], not the 40/96/80 this bake was derived against -- re-derive the bands before emitting.`,
    );
  }
  return { cells, bands, cg: cgramOf(out), vram };
};

export { captureLoader };
