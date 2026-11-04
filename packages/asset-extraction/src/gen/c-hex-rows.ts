/* @layer shared-asset-extraction @kind logic */
import { hexByte } from './c-hex-byte';

const hexRows = (data: Uint8Array, perRow = 16, indent = '  '): string[] => {
  const rows: string[] = [];
  for (let i = 0; i < data.length; i += perRow) {
    rows.push(`${indent}${Array.from(data.subarray(i, i + perRow), hexByte).join(',')},`);
  }
  return rows;
};

export { hexRows };
