/* @layer bridge-wasm @kind logic */
import { opEquals } from '../../randomizer/apply/modes/op-equals';
import type { ScriptSplice } from '../../randomizer/apply/script/script-splice.type';
import type { FastTabSpot, SpotSplices, TabOp } from './fast-tab-spot.type';
import { NOTHING, OP_ADD_ITEM, OP_EXPLORE_MODE, OP_SET_BIT, TAB_FUNCTION, TEXT_BOX_OPS } from './fast-tab-spots.constants';
import { readTabOps } from './read-tab-ops';

const scopeOf = (spot: FastTabSpot, first = false) => ({ object: spot.object, fn: TAB_FUNCTION, first });

const dropExplore = (spot: FastTabSpot, ops: TabOp[]): ScriptSplice[] =>
  ops.filter((o) => o.op === OP_EXPLORE_MODE).map(() => ({
    scene: spot.scene,
    scope: scopeOf(spot, true),
    anchor: (op: Uint8Array) => op[0] === OP_EXPLORE_MODE,
    replace: NOTHING,
    why: `fast-tab-${spot.scene.toString(16)}-explore`,
  }));

const moveBit = (spot: FastTabSpot, ops: TabOp[]): ScriptSplice[] => {
  const text = ops.findIndex((o) => TEXT_BOX_OPS.includes(o.op));
  const bits = ops.filter((o) => o.op === OP_SET_BIT);
  const bit = bits[0];
  if (text < 0 || !bit || bits.length !== 1 || ops.indexOf(bit) < text) return [];
  const add = [OP_ADD_ITEM, spot.item];
  const base = { scene: spot.scene, scope: scopeOf(spot), why: `fast-tab-${spot.scene.toString(16)}-bit` };
  return [
    { ...base, anchor: opEquals([...bit.bytes]), replace: NOTHING },
    { ...base, anchor: opEquals(add), replace: Uint8Array.from([...bit.bytes, ...add]) },
  ];
};

const planTabSplices = (pack: Uint8Array, spot: FastTabSpot): SpotSplices => {
  const ops = readTabOps(pack, spot);
  const adds = ops?.filter((o) => o.op === OP_ADD_ITEM && o.bytes[1] === spot.item) ?? [];
  if (!ops || adds.length !== 1) {
    return { splices: [], notes: [`fast-tab scene ${spot.scene.toString(16)} object ${spot.object}: tab pickup not as expected, skipped`] };
  }
  return { splices: [...dropExplore(spot, ops), ...moveBit(spot, ops)], notes: [] };
};

export { planTabSplices };
