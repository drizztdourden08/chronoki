/* @layer bridge-wasm @kind constants */
import { WRAM_BANK_7F } from '../../../game-info/wram-map.constants';
import { OBJECTIVE_GATE_AT } from '../../world/bucket/bucket.constants';

const GATE_BYTE = OBJECTIVE_GATE_AT - WRAM_BANK_7F - 0x100;

export { GATE_BYTE };
