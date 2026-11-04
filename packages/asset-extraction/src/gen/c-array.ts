/* @layer shared-asset-extraction @kind logic */
import { hexRows } from './c-hex-rows';

const cArray = (type: string, name: string, data: Uint8Array): string[] => [
  `static const ${type} ${name}[${data.length}] = {`,
  ...hexRows(data),
  '};',
];

export { cArray };
