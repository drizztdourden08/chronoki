/* @layer shared-asset-extraction @kind types */
/** One ROM table the engine reads: (name, start file offset, end file offset). */
type RomTable = [string, number, number];

export type { RomTable };
