/* @layer bridge-wasm @kind constants */
import { PENDANT_CHARGED_MASK, PENDANT_CHARGED_OFFSET } from '../../checks/sealed-pendant.constants';
import type { CtFlagBit } from './ct-start-state.type';

const FLAG_BASE = 0x7f0000;

const EARLY_PENDANT_FLAGS: readonly CtFlagBit[] = [{ at: FLAG_BASE + PENDANT_CHARGED_OFFSET, bits: PENDANT_CHARGED_MASK }];

const UNLOCKED_MAGIC_FLAGS: readonly CtFlagBit[] = [];

export { EARLY_PENDANT_FLAGS, UNLOCKED_MAGIC_FLAGS };
