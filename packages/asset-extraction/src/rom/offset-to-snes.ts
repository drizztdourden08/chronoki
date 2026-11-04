/* @layer shared-asset-extraction @kind logic */

const offsetToSnes = (offset: number): [number, number] => [0xc0 + (offset >> 16), offset & 0xffff];

export { offsetToSnes };
