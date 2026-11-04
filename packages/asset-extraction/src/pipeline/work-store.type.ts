/* @layer shared-asset-extraction @kind types */
/**
 * The workdir the stages read and write: setup.py's --workdir tree (saves/, src/data/, build/recipes/).
 * Structurally a subset of Brock's FileStore, so a FileStore (userData on a device) passes as it is, and
 * `createMemWorkStore` serves tests and in-memory runs.
 */
interface WorkStore {
  readBytes: (path: string) => Promise<Uint8Array | null>;
  writeBytes: (path: string, data: Uint8Array) => Promise<void>;
  exists: (path: string) => Promise<boolean>;
}

export type { WorkStore };
