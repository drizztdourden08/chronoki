/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { TABLES_PATH } from '../pipeline/setup-runners';
import type { StageRun } from '../pipeline/stage.type';
import { requireBytes } from '../pipeline/work-files';
import { buildPack, layoutOf } from './build-pack';
import { createHeaders } from './c-parse/headers';
import type { Headers } from './c-parse/headers';
import { fnv64 } from './fnv64';
import { PackError } from './pack-error';

const SHAPE_MARK = '/* SHAPE of a generated file';
const BASE_HEADER = 'battle_anim.h';

/** pack_tables.py parse_dir(): battle_anim.h first (two headers use its types), the rest by name. */
const parseOrder = (names: string[]): string[] => [...names].sort().sort((a, b) => Number(a !== BASE_HEADER) - Number(b !== BASE_HEADER));

const startsWithShapeMark = (bytes: Uint8Array): boolean =>
  new TextDecoder('latin1').decode(bytes.subarray(0, SHAPE_MARK.length)) === SHAPE_MARK;

/** The headers' names: every shape under data/ has the generated header it stands for. */
const headerNames = (ctx: ImportContext): string[] => {
  if (ctx.kit?.shapes === undefined) throw new PackError('the Belthasar kit shapes are needed');
  return Object.keys(ctx.kit.shapes)
    .filter((k) => k.startsWith('data/') && k.endsWith('.h'))
    .map((k) => k.slice('data/'.length));
};

const layoutHashes = (hs: Headers): Map<string, bigint> => new Map(hs.tables.map((t) => [t.name, fnv64(layoutOf(t))]));

/** The pack carries the layouts of the real headers; they must be the shapes' layouts (same target width). */
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

/** gen/pack_tables.py pack: src/data/*.h parsed, laid out for ctx.abi, written as build/ct_tables.dat. */
const packTablesStage: StageRun = async (ctx) => {
  const names = headerNames(ctx);
  const hs = createHeaders(ctx.abi);
  const stillShapes: string[] = [];
  for (const n of parseOrder(names)) {
    const bytes = await requireBytes(ctx.work, `src/data/${n}`);
    if (startsWithShapeMark(bytes)) stillShapes.push(n);
    hs.parseFile(bytes, n);
  }
  if (stillShapes.length > 0) {
    throw new PackError(`${stillShapes.length} header(s) are still shapes, not generated from the ROM: ${stillShapes.sort().join(', ')}`);
  }
  const { pack, built } = buildPack({ tables: hs.tables, defines: hs.numericDefines(), evalConst: hs.evalConst, abi: ctx.abi });
  checkAgainstShapes(ctx, names, hs);
  await ctx.work.writeBytes(TABLES_PATH, pack);
  ctx.log(`pack_tables: ${built.length} tables, ${pack.length} bytes -> ${TABLES_PATH}`);
};

export { packTablesStage };
