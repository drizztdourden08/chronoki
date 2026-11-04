/* @layer shared-asset-extraction @kind types */
import type { Sprite } from '../shared/oam-decode';

type Mon = Map<number, Sprite[]>;
type CronoStep = [F: number, dx: number | null, dy: number | null, pose: number];
type GatoStep = [F: number, dx: number, dy: number, arm: number, footDY: number];
type BobStep = [F: number, dx: number, dy: number, state: number];

export type { Mon, CronoStep, GatoStep, BobStep };
