/* @layer shared-asset-extraction @kind logic */
/** Python's "%Nd": right-aligned decimal. */
const dec = (value: number, width: number): string => String(value).padStart(width, ' ');

/** Python's "%0NX": upper-case hex, zero-padded. */
const hexN = (value: number, digits: number): string => value.toString(16).toUpperCase().padStart(digits, '0');

export { dec, hexN };
