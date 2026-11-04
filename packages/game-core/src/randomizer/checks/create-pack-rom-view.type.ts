/* @layer bridge-wasm @kind type */
type RomView = (rom: number) => number | null;
type TableSpan = { id: number; start: number; length: number };

export type { RomView, TableSpan };
