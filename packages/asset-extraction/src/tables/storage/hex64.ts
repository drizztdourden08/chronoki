/* @layer shared-asset-extraction @kind logic */

const hex64 = (h: bigint): string => `0x${h.toString(16).toUpperCase().padStart(16, '0')}ULL`;

export { hex64 };
