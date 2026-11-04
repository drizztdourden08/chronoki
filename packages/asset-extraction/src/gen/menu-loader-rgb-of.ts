/* @layer shared-asset-extraction @kind logic */
import { x5 } from './ctgen/menugfx';
import type { Rgb } from './menu-loader-art.type';

const rgbOf = (w: number): Rgb => [x5(w & 31), x5((w >> 5) & 31), x5((w >> 10) & 31)];

export { rgbOf };
