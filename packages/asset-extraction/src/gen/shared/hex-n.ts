/* @layer shared-asset-extraction @kind logic */
const hexN = (value: number, digits: number): string => value.toString(16).toUpperCase().padStart(digits, '0');

export { hexN };
