/* @layer renderer-appshell @kind logic */
const PATTERN_SEED = 0xa5;

const sramPattern = (length: number): Uint8Array => Uint8Array.from({ length }, (_, i) => (i * 7 + PATTERN_SEED) & 0xff);

export { sramPattern };
