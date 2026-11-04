/* @layer shared-asset-extraction @kind logic */
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { requireBytes } from '../pipeline/work-files';
import { buildPack } from '../tables/build-pack';
import { mergeTablesInto } from '../ctas/table-container';
import { parseWorkHeaders } from '../tables/pack-headers';
import { writeTablesStorage } from '../tables/storage/storage-writer';
import { NATIVE64_ABI, WASM32_ABI } from '../tables/table-abi.constants';
import type { TableAbi } from '../tables/table-abi.type';
import { createFsWorkStore } from './fs-work-store';

const ABIS: Record<string, TableAbi> = { native64: NATIVE64_ABI, wasm32: WASM32_ABI };
const USAGE = 'usage: node packages/asset-extraction/src/cli/repack.ts --work <dir> --abi native64|wasm32 --out <dir>';

const readAssets = async (work: ReturnType<typeof createFsWorkStore>): Promise<Uint8Array> =>
  (await work.readBytes('ct_assets.dat')) ?? requireBytes(work, 'build/ct_assets.dat');

const repack = async (argv: string[]): Promise<number> => {
  const { values } = parseArgs({ args: argv, options: { work: { type: 'string' }, abi: { type: 'string' }, out: { type: 'string' } } });
  const abi = ABIS[values.abi ?? ''];
  if (values.work === undefined || values.out === undefined || abi === undefined) {
    console.error(USAGE);
    return 2;
  }
  const work = createFsWorkStore(values.work);
  const out = createFsWorkStore(values.out);
  const names = (await readdir(join(values.work, 'src', 'data'))).filter((n) => n.endsWith('.h'));
  const hs = await parseWorkHeaders(work, names, abi);
  const { pack, built } = buildPack({ tables: hs.tables, defines: hs.numericDefines(), evalConst: hs.evalConst, abi });
  const assets = mergeTablesInto(await readAssets(work), pack);
  await out.writeBytes('ct_assets.dat', assets);
  await out.writeBytes('tables_storage.c', new TextEncoder().encode(writeTablesStorage(hs)));
  console.log(`repack ${abi.name}: ${built.length} tables, pack ${pack.length} bytes, ct_assets.dat ${assets.length} bytes -> ${values.out}`);
  return 0;
};

export { repack };
