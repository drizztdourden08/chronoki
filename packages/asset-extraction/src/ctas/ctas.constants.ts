/* @layer shared-asset-extraction @kind constants */
const CTAS_MAGIC = [0x43, 0x54, 0x41, 0x53] as const; // "CTAS"
/** extract_assets.py build(): the player's asset container is version 3. */
const CTAS_ASSETS_VERSION = 3;
/** pack_tables.py container(): the table pack's own container is version 1. */
const CTAS_PACK_VERSION = 1;
const CTAS_HEADER_BYTES = 12;
const CTAS_DIR_ENTRY_BYTES = 16;

/** Table-pack entry types (pack_tables.py T_*): they share no number with the asset types. */
const T_TABLE_HEADER = 64;
const T_TABLE = 65;
const T_TABLE_POOL = 66;
const T_TABLE_DEFINES = 67;
const TABLE_ENTRY_TYPES: readonly number[] = [T_TABLE_HEADER, T_TABLE, T_TABLE_POOL, T_TABLE_DEFINES];

export {
  CTAS_ASSETS_VERSION,
  CTAS_DIR_ENTRY_BYTES,
  CTAS_HEADER_BYTES,
  CTAS_MAGIC,
  CTAS_PACK_VERSION,
  TABLE_ENTRY_TYPES,
  T_TABLE,
  T_TABLE_DEFINES,
  T_TABLE_HEADER,
  T_TABLE_POOL,
};
