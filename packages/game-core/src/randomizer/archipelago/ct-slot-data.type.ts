/* @layer bridge-wasm @kind type */
import type { CtOptionValues } from '../world/ct-world-input.type';

type CtSlotData = {
  options: CtOptionValues;
  seed: string;
  worldVersion: string;
  deathLink: boolean;
};

export type { CtSlotData };
