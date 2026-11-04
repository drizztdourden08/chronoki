/* @layer shared-asset-extraction @kind constants */
import type { OpHandler } from './script-run.type';
import { FLOW_OPS } from './script-ops-flow';
import { DATA_OPS } from './script-ops-data';
import { ACTOR_OPS } from './script-ops-actor';

const OP_HANDLERS = new Map<number, OpHandler>([...FLOW_OPS, ...DATA_OPS, ...ACTOR_OPS]);
const STOP_OPS = new Set([0x00, 0xaf, 0xb0, 0xb1, 0xb2]);
const OP_LIMIT = 6000;

export { OP_HANDLERS, STOP_OPS, OP_LIMIT };
