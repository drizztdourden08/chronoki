/* @layer shared-asset-extraction @kind logic */
import { ANIM_OPS, ANIM_OP_JT } from './battle-anim.constants';
import { wordAt } from '../bytes/word-at';

const animHandler = (rom: Uint8Array, op: number): number => (op < ANIM_OPS ? wordAt(rom, ANIM_OP_JT + 2 * op) : -1);

export { animHandler };
