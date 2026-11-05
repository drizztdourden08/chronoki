/* @layer renderer-lib @kind logic */
import { platformFiles } from '../platform-files';
import { extractPartySprites } from './extract-party-sprites';
import { partySpriteStore, partySpritesDigest } from './party-sprite-store';
import type { PartySpritesResult } from './sprites-store.type';

const ensurePartySprites = async (romFile: string): Promise<PartySpritesResult> => {
  const files = platformFiles();
  const missing = await partySpriteStore.missing(files, romFile);
  const stale = missing.length === 0 && (await partySpriteStore.isStale(files, romFile, partySpritesDigest()));
  if (missing.length === 0 && !stale) return { success: true };
  return extractPartySprites(romFile);
};

export { ensurePartySprites };
