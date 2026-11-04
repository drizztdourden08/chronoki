/* @layer shared-asset-extraction @kind logic */
import type { StageRun } from '../pipeline/stage.type';
import { locationStreams, sequenceStreams } from './closure-locations';
import { menuStreams, spriteStreams, stageStreams, worldStreams } from './closure-world';
import { runTool } from './capture-io';

/** gen/lz_pack.py SOURCES: each a closure over the ROM's own pointer tables, {what: stream offsets}. */
const sources = (rom: Uint8Array): Map<string, Set<number>>[] => [
  locationStreams(rom),
  sequenceStreams(rom),
  spriteStreams(rom),
  menuStreams(),
  worldStreams(rom),
  stageStreams(rom),
];

/** build/lz_pack.list: the comment line and every offset, sorted and unique, as %06X lines. */
const lzList = (rom: Uint8Array): string => {
  const per: string[] = [];
  const offs = new Set<number>();
  for (const source of sources(rom)) {
    for (const [what, got] of source) {
      per.push(`${what} ${got.size}`);
      for (const o of got) offs.add(o);
    }
  }
  const lines = [...offs].sort((a, b) => a - b).map((o) => `${o.toString(16).toUpperCase().padStart(6, '0')}\n`);
  return `# tools/gen/lz_pack.py: ${per.join(', ')}\n${lines.join('')}`;
};

/** saves/lz_pack.bin (and .skipped): the LZ streams the game decompresses at run time (ct.exe --lzpack). */
const lzPackStage: StageRun = async (ctx) => {
  const list = new TextEncoder().encode(lzList(ctx.rom));
  await ctx.work.writeBytes('build/lz_pack.list', list);
  const args = ['--lzpack', '{in:list}', '{out:lz_pack.bin}', '{out:lz_pack.skipped}'];
  const got = await runTool(ctx, 'lz_pack', args, ['lz_pack.bin', 'lz_pack.skipped'], null, { list });
  await ctx.work.writeBytes('saves/lz_pack.bin', got['lz_pack.bin'] as Uint8Array);
  if (got['lz_pack.skipped']) await ctx.work.writeBytes('saves/lz_pack.skipped', got['lz_pack.skipped']);
};

export { lzList, lzPackStage };
