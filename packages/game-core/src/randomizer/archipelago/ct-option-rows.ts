/* @layer bridge-wasm @kind logic */
import { exportedOptionsOf } from '@drizztdourden08/brock-randomizer/archipelago';
import type { ExportedOption } from '@drizztdourden08/brock-randomizer/archipelago';
import { ctApOptionDefs } from './ct-ap-option-defs';

let rows: readonly ExportedOption[] | undefined;

const ctOptionRows = (): readonly ExportedOption[] => {
  rows ??= exportedOptionsOf(ctApOptionDefs());
  return rows;
};

export { ctOptionRows };
