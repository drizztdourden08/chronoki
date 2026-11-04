/* @layer shared-asset-extraction @kind logic */
const dec = (value: number, width: number): string => String(value).padStart(width, ' ');

const hexN = (value: number, digits: number): string => value.toString(16).toUpperCase().padStart(digits, '0');

export { dec, hexN };
