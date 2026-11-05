/* @layer renderer-lib @kind logic */
import { spriteDigestOf } from '@drizztdourden08/brock-port-kit';
import { PARTY_SPRITE_NAMES } from './sprites-store.constants';

const partySpritesDigest = (): string => spriteDigestOf(PARTY_SPRITE_NAMES);

export { partySpritesDigest };
