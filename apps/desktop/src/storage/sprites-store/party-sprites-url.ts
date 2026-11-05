/* @layer renderer-lib @kind logic */
import { spriteBaseUrl } from '@drizztdourden08/brock-port-kit';
import { partySpriteDir } from './party-sprite-dir';

const partySpritesUrl = (romFile: string): string => spriteBaseUrl(romFile, { dirOf: partySpriteDir });

export { partySpritesUrl };
