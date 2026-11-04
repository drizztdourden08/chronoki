/* @layer shared-asset-extraction @kind logic */
import { peekOracle } from '../oracle/peek-access';
import { recipeState } from '../oracle/recipe-state';
import type { PeekDump } from '../oracle/peek.type';
import type { StageRun } from '../pipeline/stage.type';
import { runTool } from './run-tool';
import { cgramOf } from './cgram-of';
import { cgramWords } from './ow-decode16';
import { decode16 } from './decode16';
import { sprFrames } from './spr-frames';
import { GULL_NAMES, GULL_PAL, BALLOON_FRAME, EXPL } from './ow-sprites.constants';

const key = (px: Uint8Array): string => String.fromCharCode(...px);

const gulls = (birds: Uint8Array, w0Peek: PeekDump): Uint8Array => {
  const cg = cgramWords(cgramOf(w0Peek));
  const tiles = new Map(GULL_NAMES.map((nm) => [key(decode16(w0Peek.vram, cg, nm, GULL_PAL)), nm]));
  const keep = sprFrames(birds).filter((f) => tiles.has(key(f.px)));
  const names = keep.map((f) => tiles.get(key(f.px)) as number);
  if ([...names].sort((a, b) => a - b).join() !== GULL_NAMES.join()) {
    throw new Error(`ow_sprites: the --owbirds atlas does not hold each gull tile exactly once: ${names.map((n) => n.toString(16).toUpperCase().padStart(3, '0')).join(' ')}`);
  }
  const parts = keep.map((f, k) => [Uint8Array.of(k, 0, 0, 16, 16, 0xf8, 0xf8), f.px]).flat();
  return Uint8Array.from([keep.length, ...parts.flatMap((p) => [...p])]);
};

const balloons = (vram: Uint8Array, cg: number[], base = 0): Uint8Array => {
  const frames: [number, number][] = [...EXPL.map((ch): [number, number] => [ch, 1]), [0x0a, 1], [0x0a, 2], [0x0a, 3]];
  const out: number[] = [frames.length];
  frames.forEach(([ch, pal], i) => out.push(i, ch, pal, 16, 16, 0xf8, 0xf8, ...decode16(vram, cg, ch, pal, base)));
  return Uint8Array.from(out);
};

const owSpritesStage: StageRun = async (ctx) => {
  const w0 = await recipeState(ctx, 'ow_nav_w0');
  const tool = async (mode: string, name: string): Promise<Uint8Array> =>
    (await runTool(ctx, 'ow_sprites', [mode, '{state}', `{out:${name}}`], [`${name}.spr`], w0))[`${name}.spr`] as Uint8Array;
  await ctx.work.writeBytes('saves/ow_crono.spr', await tool('--owsprite', 'ow_crono'));
  await ctx.work.writeBytes('saves/ow_boat.spr', await tool('--owboat', 'ow_boat'));
  const oracle = peekOracle(ctx);
  const birds = await tool('--owbirds', 'ow_birds');
  const gullPeek = await oracle.peek({ state: w0, script: '0:40', rule: false });
  await ctx.work.writeBytes('saves/ow_gulls.spr', gulls(birds, gullPeek));
  const pan = await recipeState(ctx, 'ow_intro_pan');
  const x = await oracle.peek({ state: pan, script: `0:${BALLOON_FRAME}` });
  await ctx.work.writeBytes('saves/ow_balloons.spr', balloons(x.vram, cgramWords(cgramOf(x))));
  ctx.log('ow_sprites: ow_crono ow_boat ow_gulls ow_balloons -> saves');
};

export { owSpritesStage };
