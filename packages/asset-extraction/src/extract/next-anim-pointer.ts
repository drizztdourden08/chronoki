/* @layer shared-asset-extraction @kind logic */
import { ANIM_LIMIT } from './sprite-anims.constants';

const nextAnimPointer = (fp: number[], base: number): number => Math.min(...fp.filter((a) => a > base), ANIM_LIMIT);

export { nextAnimPointer };
