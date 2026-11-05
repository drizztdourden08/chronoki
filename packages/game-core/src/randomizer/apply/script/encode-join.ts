/* @layer bridge-wasm @kind logic */
import { OP_JOIN } from './script-ops.constants';

const encodeJoin = (character: number): Uint8Array => Uint8Array.of(OP_JOIN, character & 0xff);

export { encodeJoin };
