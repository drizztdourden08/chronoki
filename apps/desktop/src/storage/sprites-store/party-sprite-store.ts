/* @layer renderer-lib @kind logic */
import { createSpriteStore, spriteDigestOf } from '@drizztdourden08/brock-port-kit';
import { partySpriteDir } from './party-sprite-dir';
import { PARTY_SPRITE_NAMES } from './sprites-store.constants';

const partySpritesDigest = (): string => spriteDigestOf(PARTY_SPRITE_NAMES);

const manifestOfReceipt = (text: string | null): string | null => {
  if (!text) return null;
  try {
    const receipt: unknown = JSON.parse(text);
    const manifest = (receipt as { manifest?: unknown } | null)?.manifest;
    return typeof manifest === 'string' ? manifest : null;
  } catch {
    return null;
  }
};

const partySpriteStore = createSpriteStore({
  manifest: {
    expected: PARTY_SPRITE_NAMES,
    digest: partySpritesDigest,
    dirOf: partySpriteDir,
    stamp: { file: 'extraction.json', parse: manifestOfReceipt },
  },
});

export { partySpriteStore, partySpritesDigest };
