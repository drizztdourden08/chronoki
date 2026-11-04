/* @layer shared-asset-extraction @kind logic */
/** Python's "0x%02X" / "0x%04X" / "0x%06X": upper-case hex, zero-padded. */
const hex = (value: number, digits: number): string => value.toString(16).toUpperCase().padStart(digits, '0');

const hexByte = (value: number): string => `0x${hex(value, 2)}`;

/** `data` as C initializer rows of `perRow` bytes: "<indent>0x00,0x01,...,", one line per row (no trailing newline). */
const hexRows = (data: Uint8Array, perRow = 16, indent = '  '): string[] => {
  const rows: string[] = [];
  for (let i = 0; i < data.length; i += perRow) {
    rows.push(`${indent}${Array.from(data.subarray(i, i + perRow), hexByte).join(',')},`);
  }
  return rows;
};

/** `static const <type> <name>[n] = { ... };` as the generators write it (rows, then the closing brace line). */
const cArray = (type: string, name: string, data: Uint8Array): string[] => [
  `static const ${type} ${name}[${data.length}] = {`,
  ...hexRows(data),
  '};',
];

export { cArray, hex, hexByte, hexRows };
