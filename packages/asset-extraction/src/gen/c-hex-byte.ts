/* @layer shared-asset-extraction @kind logic */
import { hex } from './c-hex';

const hexByte = (value: number): string => `0x${hex(value, 2)}`;

export { hexByte };
