/* @layer bridge-wasm @kind logic */
import type { CtExitSpec, CtRegionSpec } from '../ct-region-spec.type';
import type { CtRegionId } from '../ct-world-keys.type';
import type { CtModeDef } from '../modes/ct-mode-def.type';
import { modeGateOf } from './mode-gate-of';
import { SHAPE_MENU_REGION } from './shape.constants';

const startExitsOf = (modes: readonly CtModeDef[]): CtExitSpec[] =>
  [...new Set<CtRegionId>(modes.map((mode) => mode.start))].map((start): CtExitSpec => {
    const rule = modeGateOf(new Set(modes.filter((mode) => mode.start === start).map((mode) => mode.id)), undefined);
    return rule === undefined ? { to: start } : { to: start, rule };
  });

const shapeStartHub = (modes: readonly CtModeDef[]): CtRegionSpec => ({
  id: SHAPE_MENU_REGION,
  name: 'Menu',
  era: 'none',
  exits: startExitsOf(modes),
  spots: [],
  events: [],
  maps: [],
});

export { shapeStartHub };
