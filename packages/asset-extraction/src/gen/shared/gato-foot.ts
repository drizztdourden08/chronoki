/* @layer shared-asset-extraction @kind logic */
const gatoFoot = (wram: Uint8Array): [number, number] => [wram[0x1d0c + 6] as number, wram[0x1d23 + 6] as number];

export { gatoFoot };
