/* @layer bridge-wasm @kind constants */
import { PENDANT_CHARGED_MASK, PENDANT_CHARGED_OFFSET } from '../../checks/sealed-pendant.constants';
import type { CtFlagBit } from './ct-start-state.type';

const FLAG_BASE = 0x7f0000;

// Sourced from this repo: the game's own sealed-chest scripts test this bit (checks/sealed-pendant.constants.ts).
const EARLY_PENDANT_FLAGS: readonly CtFlagBit[] = [{ at: FLAG_BASE + PENDANT_CHARGED_OFFSET, bits: PENDANT_CHARGED_MASK }];

// Left empty on purpose (I-111). Spekkio's scene (location 0x1D1, object 9) writes 7F01E0 bits 0-4 and 6 (who was taught),
// 7E2830/31/32/34 = 3, 7E2837/38/39/3B |= 0xE0 and a word at +0x2D of Crono, Marle, Lucca, Frog (7E262D/7D/CD, 7E276D).
// Which of these the game needs is unproven, and together they cost about 77 bytes of the 103-byte start block.
const UNLOCKED_MAGIC_FLAGS: readonly CtFlagBit[] = [];

export { EARLY_PENDANT_FLAGS, UNLOCKED_MAGIC_FLAGS };
