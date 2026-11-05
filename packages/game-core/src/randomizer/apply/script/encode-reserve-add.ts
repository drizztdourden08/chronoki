/* @layer bridge-wasm @kind logic */
import { OP_RESERVE_ADD } from './script-ops.constants';

const encodeReserveAdd = (character: number): Uint8Array => Uint8Array.of(OP_RESERVE_ADD, character & 0xff);

export { encodeReserveAdd };
