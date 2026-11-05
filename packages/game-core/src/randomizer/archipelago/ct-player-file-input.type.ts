/* @layer bridge-wasm @kind type */
import type { ExportedOption } from '@drizztdourden08/brock-randomizer/archipelago';
import type { CtWorldInput } from '../world/ct-world-input.type';

type CtPlayerFileInput = {
  world: CtWorldInput;
  schemaRows?: readonly ExportedOption[];
  slotName?: string;
  appVersion?: string;
  seedText?: string;
  deathLink?: boolean;
  preRolled?: Record<string, unknown>;
};

export type { CtPlayerFileInput };
