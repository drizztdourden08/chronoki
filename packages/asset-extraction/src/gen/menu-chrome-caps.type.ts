/* @layer shared-asset-extraction @kind type */
interface ChromeCaptures {
  ribbon: number[][];
  entered: number[][];
  equip: number[];
  equipList: number[];
  exchange: number[];
  vram0: Uint8Array;
  cg0: Uint8Array;
}
interface Cap {
  vram: Uint8Array;
  wram: Uint8Array;
  cg: Uint8Array;
}

export type { ChromeCaptures, Cap };
