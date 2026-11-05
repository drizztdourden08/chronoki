/* @layer bridge-wasm @kind constants */
import { PENDANT_CHARGED_MASK, PENDANT_CHARGED_OFFSET } from '../../checks/sealed-pendant.constants';
import type { CtFlagBit } from './ct-start-state.type';

const FLAG_BASE = 0x7f0000;

// Sourced from this repo: the game's own sealed-chest scripts test this bit (checks/sealed-pendant.constants.ts).
const EARLY_PENDANT_FLAGS: readonly CtFlagBit[] = [{ at: FLAG_BASE + PENDANT_CHARGED_OFFSET, bits: PENDANT_CHARGED_MASK }];

// Left empty on purpose (I-111): the Spekkio state is too big for the 103-byte start block, so it is written into
// memory after New Game by session/create-start-magic-grant.ts (evidence in start-magic-grant.constants.ts).
const UNLOCKED_MAGIC_FLAGS: readonly CtFlagBit[] = [];

export { EARLY_PENDANT_FLAGS, UNLOCKED_MAGIC_FLAGS };
