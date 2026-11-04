/* @layer shared-asset-extraction @kind constants */
const PREC: string[][] = [['|'], ['^'], ['&'], ['<<', '>>'], ['+', '-'], ['*', '/', '%']];

const MAX_DEPTH = 50;

export { PREC, MAX_DEPTH };
