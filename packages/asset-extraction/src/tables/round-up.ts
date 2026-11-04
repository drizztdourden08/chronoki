/* @layer shared-asset-extraction @kind logic */

const roundUp = (value: number, align: number): number => Math.floor((value + align - 1) / align) * align;

export { roundUp };
