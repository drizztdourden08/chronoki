/* @layer bridge-wasm @kind logic */
import { opEquals } from '../modes/op-equals';
import type { ScriptSplice } from '../script/script-splice.type';
import { bucketGateBytes } from './bucket-gate-bytes';
import { BUCKET_ANCHOR, BUCKET_SCENE } from './bucket-gate.constants';

const planBucketSplices = (): ScriptSplice[] => [
  { scene: BUCKET_SCENE, anchor: opEquals(BUCKET_ANCHOR), replace: bucketGateBytes(), why: 'bucket-gate' },
];

export { planBucketSplices };
