/* @layer bridge-wasm @kind constants */
import { PENDANT_CHARGED_MASK, PENDANT_CHARGED_OFFSET } from '../../checks/sealed-pendant.constants';
import type { CtFlagBit } from './ct-start-state.type';

const FLAG_BASE = 0x7f0000;

// Sourced from this repo: the game's own sealed-chest scripts test this bit (checks/sealed-pendant.constants.ts).
const EARLY_PENDANT_FLAGS: readonly CtFlagBit[] = [{ at: FLAG_BASE + PENDANT_CHARGED_OFFSET, bits: PENDANT_CHARGED_MASK }];

// UNVERIFIED: the Spekkio "magic learned" script flag is not in the public RAM map (Data Crystal lists no such entry).
// Left empty so nothing is written until the flag is confirmed headlessly; fill in { at, bits } then.
const UNLOCKED_MAGIC_FLAGS: readonly CtFlagBit[] = [];

export { EARLY_PENDANT_FLAGS, UNLOCKED_MAGIC_FLAGS };
