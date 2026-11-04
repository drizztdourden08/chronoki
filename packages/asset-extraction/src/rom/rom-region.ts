/* @layer shared-asset-extraction @kind logic */

const romRegion = (rom: Uint8Array, lo: number, hi: number): Uint8Array => rom.slice(lo, hi);

export { romRegion };
