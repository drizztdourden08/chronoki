/* @layer shared-asset-extraction @kind logic */
import type { StageRun } from '../pipeline/stage.type';
import { runTool } from './run-tool';
import { lzList } from './lz-pack';

const lzPackStage: StageRun = async (ctx) => {
  const list = new TextEncoder().encode(lzList(ctx.rom));
  await ctx.work.writeBytes('build/lz_pack.list', list);
  const args = ['--lzpack', '{in:list}', '{out:lz_pack.bin}', '{out:lz_pack.skipped}'];
  const got = await runTool(ctx, { name: 'lz_pack', args, outputs: ['lz_pack.bin', 'lz_pack.skipped'], inputs: { list } });
  await ctx.work.writeBytes('saves/lz_pack.bin', got['lz_pack.bin'] as Uint8Array);
  if (got['lz_pack.skipped']) await ctx.work.writeBytes('saves/lz_pack.skipped', got['lz_pack.skipped']);
};

export { lzPackStage };
