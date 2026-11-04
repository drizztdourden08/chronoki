/* @layer shared-asset-extraction @kind types */
import type { Rgb } from './snes-color';

type PaletteAnim = [typ: number, ci: number, cc: number, delay: number, frames: number[], colors: Rgb[]];

export type { PaletteAnim };
