/* @layer shared-asset-extraction @kind logic */
import { hexByte } from '../c-hex-byte';

const sheetRows = (tiles: Uint8Array[]): string =>
  tiles.map((t) => `  {${Array.from(t, hexByte).join(',')}},\n`).join('');

export { sheetRows };
