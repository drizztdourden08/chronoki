/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { TABLES_PATH } from '../pipeline/setup-runners';
import type { StageRun } from '../pipeline/stage.type';
import { buildPack, layoutOf } from './build-pack';
import { createHeaders } from './c-parse/headers';
import type { Headers } from './c-parse/headers.type';
import { fnv64 } from './fnv64';
import { PackError } from './pack-error';
import { parseOrder, parseWorkHeaders } from './pack-headers';

const headerNames = (ctx: ImportContext): string[] => {
  if (ctx.kit?.shapes === undefined) throw new PackError('the Belthasar kit shapes are needed');
  return Object.keys(ctx.kit.shapes)
    .filter((k) => k.startsWith('data/') && k.endsWith('.h'))
    .map((k) => k.slice('data/'.length));
};

const layoutHashes = (hs: Headers): Map<string, bigint> => new Map(hs.tables.map((t) => [t.name, fnv64(layoutOf(t))]));

const checkAgainstShapes = (ctx: ImportContext, names: string[], have: Headers): void => {
  const shapes = ctx.kit?.shapes ?? {};
  const want = createHeaders(ctx.abi);
  const enc = new TextEncoder();
  for (const n of parseOrder(names)) want.parseFile(enc.encode(shapes[`data/${n}`]), n);
  const w = layoutHashes(want);
  const h = layoutHashes(have);
  const bad = [...new Set([...w.keys(), ...h.keys()])].filter((n) => w.get(n) !== h.get(n)).sort();
  if (bad.length > 0) throw new PackError(`the headers' layout differs from the shapes: ${bad.join(', ')}`);
};

const packTablesStage: StageRun = async (ctx) => {
  const names = headerNames(ctx);
  const hs = await parseWorkHeaders(ctx.work, names, ctx.abi);
  const { pack, built } = buildPack({ tables: hs.tables, defines: hs.numericDefines(), evalConst: hs.evalConst, abi: ctx.abi });
  checkAgainstShapes(ctx, names, hs);
  await ctx.work.writeBytes(TABLES_PATH, pack);
  ctx.log(`pack_tables: ${built.length} tables, ${pack.length} bytes -> ${TABLES_PATH}`);
};

export { packTablesStage };
