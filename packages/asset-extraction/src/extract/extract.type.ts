/* @layer shared-asset-extraction @kind types */
import type { CtasEntry } from '../ctas/ctas.type';
import type { WorkStore } from '../pipeline/work-store.type';
import type { TableAbi } from '../tables/table-abi.type';

interface PackTables {
  mapPtrs: number[];
  tsGfx: number[];
  asmPtrs: number[];
  asm3Ptrs: number[];
  usedSprites: Set<number>;
  staticMax: Map<number, number>;
}

interface SpriteUsage {
  usedSprites: Set<number>;
  staticMax: Map<number, number>;
}

interface PackContext {
  rom: Uint8Array;
  tables: PackTables;
  work: WorkStore;
  abi: TableAbi;
  log: (message: string) => void;
}

type Packer = (ctx: PackContext) => CtasEntry[] | Promise<CtasEntry[]>;

export type { PackContext, PackTables, Packer, SpriteUsage };
