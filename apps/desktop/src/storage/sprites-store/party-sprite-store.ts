/* @layer renderer-lib @kind logic */
import { createSpriteStore } from '@drizztdourden08/brock-port-kit';
import { partySpriteDir } from './party-sprite-dir';
import { partySpritesDigest } from './party-sprites-digest';
import { PARTY_SPRITE_NAMES } from './sprites-store.constants';

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

export { partySpriteStore };
