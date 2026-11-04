/* @layer shared-asset-extraction @kind logic */
import type { OracleResult } from '../oracle/oracle-driver.type';
import type { WorkStore } from '../pipeline/work-store.type';
import { readText, writeText } from '../pipeline/work-files';
import { RECIPE_DIR } from './recipe-store.constants';
import { sidecarPath } from './sidecar-path';
import { sramOf } from './sram-of';

const statePath = (name: string): string => `${RECIPE_DIR}/${name}.state`;
const keyPath = (name: string): string => `${RECIPE_DIR}/${name}.key`;

const readCached = async (work: WorkStore, name: string, key: string): Promise<Uint8Array | null> => {
  const stored = await readText(work, keyPath(name));
  return stored === key ? work.readBytes(statePath(name)) : null;
};

const writeCached = async (work: WorkStore, name: string, key: string, result: OracleResult): Promise<void> => {
  await work.writeBytes(statePath(name), result.state);
  await work.writeBytes(`${statePath(name)}.srm`, sramOf(result.state));
  for (const [ext, bytes] of Object.entries(result.sidecars)) await work.writeBytes(sidecarPath(name, ext), bytes);
  await writeText(work, keyPath(name), key);
};

export { readCached, statePath, writeCached };
