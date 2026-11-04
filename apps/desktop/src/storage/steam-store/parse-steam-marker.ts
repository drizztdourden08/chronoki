/* @layer renderer-lib @kind logic */
import { STEAM_WIDE_VERSION } from './steam-store.constants';
import type { SteamMarker } from './steam-store.type';

const isMarker = (value: unknown): value is SteamMarker => {
  if (typeof value !== 'object' || value === null) return false;
  const marker = value as Partial<SteamMarker>;
  return marker.version === STEAM_WIDE_VERSION && typeof marker.sourceName === 'string' && typeof marker.sourceBytes === 'number' && typeof marker.builtAt === 'string';
};

const parseSteamMarker = (text: string | null): SteamMarker | null => {
  if (!text) return null;
  try {
    const value: unknown = JSON.parse(text);
    return isMarker(value) ? value : null;
  } catch {
    return null;
  }
};

export { parseSteamMarker };
