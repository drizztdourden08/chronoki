/* @layer shared-asset-extraction @kind logic */
import { hex } from '../c-hex';

const hexBytes = (b: Uint8Array): string => Array.from(b, (x) => `0x${hex(x, 2)}`).join(',');

export { hexBytes };
