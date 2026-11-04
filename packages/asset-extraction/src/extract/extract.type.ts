/* @layer shared-asset-extraction @kind types */
import type { CtasEntry } from '../ctas/ctas.type';
import type { WorkStore } from '../pipeline/work-store.type';
import type { TableAbi } from '../tables/table-abi.type';

/** extract_assets.build()'s `T`: the pointer tables and the sprite usage every packer may read. */
interface PackTables {
  /** get_entries_3byte(MAP_PTRS, 202) */
  mapPtrs: number[];
  /** get_entries_3byte(TS_PTRS, 204) */
  tsGfx: number[];
  /** get_entries_3byte(ASM_PTRS, 64) */
  asmPtrs: number[];
  /** get_entries_3byte(ASM3_PTRS, 19) */
  asm3Ptrs: number[];
  /** Sprites referenced by placed actors / script-loaded sprites. */
  usedSprites: Set<number>;
  /** sprite -> max 0xAC static assembly frame. */
  staticMax: Map<number, number>;
}

/** What `scanSpriteUsage` (the build() prelude over script.py) returns. */
interface SpriteUsage {
  usedSprites: Set<number>;
  staticMax: Map<number, number>;
}

/** What a packer works on: the verified ROM, T, the workdir (saves/ files) and the table-pack ABI. */
interface PackContext {
  rom: Uint8Array;
  tables: PackTables;
  work: WorkStore;
  abi: TableAbi;
  log: (message: string) => void;
}

/**
 * One extract_assets packer: Python's generator, collected into its (type, id, blob) entries in order.
 * Async because some read the workdir (pack_world's saves/ files) or run the table pack.
 */
type Packer = (ctx: PackContext) => CtasEntry[] | Promise<CtasEntry[]>;

export type { PackContext, PackTables, Packer, SpriteUsage };
