/* @layer shared-asset-extraction @kind types */
import type { OracleDriver } from '../oracle/oracle-driver.type';
import type { SteamArchive } from '../steam/steam-archive';
import type { ManifestFile } from '../recipes/manifest';
import type { TableAbi } from '../tables/table-abi.type';
import type { WorkStore } from './work-store.type';

interface KitSources {
  recipeTexts: string[];
  manifests: ManifestFile[];
  shapes?: Record<string, string>;
}

interface ImportContext {
  rom: Uint8Array;
  work: WorkStore;
  abi: TableAbi;
  oracle: OracleDriver | null;
  kit: KitSources | null;
  jobs: number;
  outDir: string;
  steam?: SteamArchive | null;
  log: (message: string) => void;
}

export type { ImportContext, KitSources };
