/* @layer shared-asset-extraction @kind logic */
const dec = (value: number, width: number): string => String(value).padStart(width, ' ');

export { dec };
