/* @layer shared-asset-extraction @kind logic */
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { requireBytes } from '../pipeline/require-bytes';
import { buildPack } from '../tables/build-pack';
import { mergeTablesInto } from '../ctas/table-container';
import { parseWorkHeaders } from '../tables/pack-headers';
import { writeTablesStorage } from '../tables/storage/storage-writer';

import { errLine } from './err-line';
import { createFsWorkStore } from './fs-work-store';
import { outLine } from './out-line';
import { ABIS, USAGE } from './repack-main.constants';

const readAssets = async (work: ReturnType<typeof createFsWorkStore>): Promise<Uint8Array> =>
  (await work.readBytes('ct_assets.dat')) ?? requireBytes(work, 'build/ct_assets.dat');

const repack = async (argv: string[]): Promise<number> => {
  const { values } = parseArgs({ args: argv, options: { work: { type: 'string' }, abi: { type: 'string' }, out: { type: 'string' } } });
  const abi = ABIS[values.abi ?? ''];
  if (values.work === undefined || values.out === undefined || abi === undefined) {
    errLine(USAGE);
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
  outLine(`repack ${abi.name}: ${built.length} tables, pack ${pack.length} bytes, ct_assets.dat ${assets.length} bytes -> ${values.out}`);
  return 0;
};

export { repack };
