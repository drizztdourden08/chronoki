/* @layer renderer-lib @kind logic */
import { PARTY_SPRITE_SUBDIR } from './sprites-store.constants';

const partySpriteDir = (romFile: string): string => `sprites/${romFile.replace(/\.(sfc|smc)$/i, '')}/${PARTY_SPRITE_SUBDIR}`;

export { partySpriteDir };
