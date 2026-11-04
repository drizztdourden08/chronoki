/* @layer shared-asset-extraction @kind logic */
import type { OracleResult } from '../oracle/oracle-driver.type';
import type { WorkStore } from '../pipeline/work-store.type';
import { writeText } from '../pipeline/write-text';
import { sidecarPath } from './sidecar-path';
import { sramOf } from './sram-of';
import { keyPath } from './key-path';
import { statePath } from './recipe-store';

const writeCached = async (work: WorkStore, name: string, key: string, result: OracleResult): Promise<void> => {
  await work.writeBytes(statePath(name), result.state);
  await work.writeBytes(`${statePath(name)}.srm`, sramOf(result.state));
  for (const [ext, bytes] of Object.entries(result.sidecars)) await work.writeBytes(sidecarPath(name, ext), bytes);
  await writeText(work, keyPath(name), key);
};

export { writeCached };
