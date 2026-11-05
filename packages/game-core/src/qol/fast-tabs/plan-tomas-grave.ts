/* @layer bridge-wasm @kind logic */
import { opEquals } from '../../randomizer/apply/modes/op-equals';
import type { FastTabSpot, SpotSplices } from './fast-tab-spot.type';
import { LOCKED, NOTHING, RUN, TAB_FUNCTION, TOMAS_GRAVE_SPOT } from './fast-tab-spots.constants';
import { readTabOps } from './read-tab-ops';

const planTomasGrave = (pack: Uint8Array, spot: FastTabSpot = TOMAS_GRAVE_SPOT): SpotSplices => {
  const ops = readTabOps(pack, spot) ?? [];
  const is = (bytes: number[]) => (o: { bytes: Uint8Array }): boolean => opEquals(bytes)(o.bytes);
  const lock = ops.findIndex(is(LOCKED));
  const run = ops.findIndex(is(RUN));
  if (lock < 0 || run < lock || ops.filter(is(RUN)).length !== 1) {
    return { splices: [], notes: ["fast-tab Toma's grave: lock and run ops not as expected, skipped"] };
  }
  const scope = { object: spot.object, fn: TAB_FUNCTION };
  return {
    splices: [
      { scene: spot.scene, scope: { ...scope, first: true }, anchor: opEquals(LOCKED), replace: NOTHING, why: 'fast-tab-grave-unlock' },
      { scene: spot.scene, scope, anchor: opEquals(RUN), replace: Uint8Array.from([...LOCKED, ...RUN]), why: 'fast-tab-grave-relock' },
    ],
    notes: [],
  };
};

export { planTomasGrave };
