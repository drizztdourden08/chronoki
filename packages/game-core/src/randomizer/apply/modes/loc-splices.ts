/* @layer bridge-wasm @kind logic */
import { encodeReserveAdd } from '../script/encode-reserve-add';
import type { ScriptSplice } from '../script/script-splice.type';
import type { ModeSplicer } from '../mode-splicer.type';
import { endingSplice } from './ending-splice';
import { LOC_ENDING, MAGUS_ANCHOR, MAGUS_ID, MAGUS_SCENE } from './loc-splices.constants';
import { opEquals } from './op-equals';

const magusSplice = (): ScriptSplice => ({
  scene: MAGUS_SCENE,
  anchor: opEquals(MAGUS_ANCHOR),
  replace: Uint8Array.from([...encodeReserveAdd(MAGUS_ID), ...MAGUS_ANCHOR]),
  why: 'loc-magus-recruit',
});

const locSplices: ModeSplicer = () => [magusSplice(), endingSplice(LOC_ENDING)];

export { locSplices };
