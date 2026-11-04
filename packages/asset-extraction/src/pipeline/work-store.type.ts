/* @layer shared-asset-extraction @kind types */
interface WorkStore {
  readBytes: (path: string) => Promise<Uint8Array | null>;
  writeBytes: (path: string, data: Uint8Array) => Promise<void>;
  exists: (path: string) => Promise<boolean>;
}

export type { WorkStore };
