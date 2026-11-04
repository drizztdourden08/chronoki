/* @layer shared-asset-extraction @kind types */
import type { OracleDriver } from '../oracle/oracle-driver.type';
import type { ManifestFile } from '../recipes/manifest';
import type { TableAbi } from '../tables/table-abi.type';
import type { WorkStore } from './work-store.type';

/**
 * Belthasar's own recipe and manifest files, read by import-core from core/belthasar/tools/ at import time
 * (they are Belthasar's, never copied here).
 */
interface KitSources {
  recipeTexts: string[];
  manifests: ManifestFile[];
  /** tools/gen/shapes/ files by path under it ("data/menu_shop.h", "xlat/seq_c3.c"): the shapes-install and pack-tables stages. */
  shapes?: Record<string, string>;
}

/** What every stage works on (the plan's ImportContext). */
interface ImportContext {
  /** The ROM: the file's bytes at the start, the verified headerless dump once `verify-rom` has run. */
  rom: Uint8Array;
  work: WorkStore;
  /** The pointer width of the table pack: native64 for the reference comparison, wasm32 for the core. */
  abi: TableAbi;
  oracle: OracleDriver | null;
  kit: KitSources | null;
  /** Recipes replayed side by side. */
  jobs: number;
  /** Where the player's files go in the workdir (setup.py --out; its default is build/player). */
  outDir: string;
  log: (message: string) => void;
}

export type { ImportContext, KitSources };
