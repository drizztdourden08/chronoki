/* @layer renderer-appshell @kind logic */
import { PATTERN_SEED } from './sram-pattern.constants';

const sramPattern = (length: number): Uint8Array => Uint8Array.from({ length }, (_, i) => (i * 7 + PATTERN_SEED) & 0xff);

export { sramPattern };
