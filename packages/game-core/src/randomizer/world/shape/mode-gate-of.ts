/* @layer bridge-wasm @kind logic */
import { FALSE, TRUE } from '@drizztdourden08/brock-randomizer/world';
import { CT_KIT } from '../ct-kit.constants';
import type { CtRule } from '../ct-region-spec.type';
import type { CtModeId } from '../modes/ct-mode-def.type';
import { SHAPE_MODES } from './shape.constants';

const { any, option, when } = CT_KIT;

const modeGateOf = (keptIn: ReadonlySet<CtModeId>, rule: CtRule | undefined): CtRule | undefined => {
  const off = SHAPE_MODES.filter((mode) => !keptIn.has(mode.id)).map((mode) => option('gameMode', mode.id));
  if (off.length === 0) return rule;
  return when(off.length === 1 ? off[0] : any(...off), FALSE, rule ?? TRUE);
};

export { modeGateOf };
