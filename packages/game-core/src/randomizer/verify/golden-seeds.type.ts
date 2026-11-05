/* @layer bridge-wasm @kind type */
import type { CtOptionValues } from '../world/ct-world-input.type';

type GoldenCase = { name: string; seed: string; options: CtOptionValues };

type GoldenPlacement = {
  seed: string;
  options: CtOptionValues;
  startParty: readonly string[];
  spots: Readonly<Record<string, string>>;
};

export type { GoldenCase, GoldenPlacement };
