/* @layer shared-asset-extraction @kind constants */
import type { OpHandler } from './script-run.type';
import { flowOps } from './script-ops-flow';
import { dataOps } from './script-ops-data';
import { actorOps } from './script-ops-actor';

const OP_HANDLERS = new Map<number, OpHandler>([...flowOps, ...dataOps, ...actorOps]);
const STOP_OPS = new Set([0x00, 0xaf, 0xb0, 0xb1, 0xb2]);
const OP_LIMIT = 6000;

export { OP_HANDLERS, STOP_OPS, OP_LIMIT };
