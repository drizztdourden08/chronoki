/* @layer shared-asset-extraction @kind logic */
import type { OracleResult } from '../oracle/oracle-driver.type';
import type { WorkStore } from '../pipeline/work-store.type';
import { readText, writeText } from '../pipeline/work-files';

const RECIPE_DIR = 'build/recipes';
const SRAM_BYTES = 8192;

const statePath = (name: string): string => `${RECIPE_DIR}/${name}.state`;
const keyPath = (name: string): string => `${RECIPE_DIR}/${name}.key`;
const sidecarPath = (name: string, ext: string): string => `${RECIPE_DIR}/${name}.raw.${ext}`;

/** recipes.py write_srm(): the battery RAM of a state is its last 8192 bytes (cart_handleState's last block). */
const sramOf = (state: Uint8Array): Uint8Array => state.slice(-SRAM_BYTES);

/** The cached state of a recipe, when its key file matches the key (recipes.py make()'s `cached()`). */
const readCached = async (work: WorkStore, name: string, key: string): Promise<Uint8Array | null> => {
  const stored = await readText(work, keyPath(name));
  return stored === key ? work.readBytes(statePath(name)) : null;
};

/** The state, its sidecars and its srm, then the key last: a half-written state never looks cached. */
const writeCached = async (work: WorkStore, name: string, key: string, result: OracleResult): Promise<void> => {
  await work.writeBytes(statePath(name), result.state);
  await work.writeBytes(`${statePath(name)}.srm`, sramOf(result.state));
  for (const [ext, bytes] of Object.entries(result.sidecars)) await work.writeBytes(sidecarPath(name, ext), bytes);
  await writeText(work, keyPath(name), key);
};

export { RECIPE_DIR, readCached, sidecarPath, sramOf, statePath, writeCached };
