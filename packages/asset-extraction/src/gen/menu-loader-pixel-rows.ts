/* @layer shared-asset-extraction @kind logic */
import { hx } from './ctgen/hx';
import type { Rgb } from './menu-loader-art.type';

const cell = (v: number, colour: Rgb): string => (v === 0 ? '0x01000000u' : `0x${colour.map((c) => hx(c, 2)).join('')}u`);

const pixelRows = (px: number[][], colourOf: (v: number) => Rgb): string =>
  px.map((row) => `    {${row.map((v) => cell(v, colourOf(v))).join(',')}},\n`).join('');

export { pixelRows };
