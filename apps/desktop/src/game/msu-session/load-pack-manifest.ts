/* @layer bridge-wasm @kind logic */
import type { MsuPackManifest } from '@drizztdourden08/brock-msu';
import { effectivePackManifest, getTrackList, readManifest } from '@drizztdourden08/brock-msu/packs';
import { ctMsuConfig } from '@chronoki/game-core';
import { platformFiles } from '@app/storage/platform-files';

const loadPackManifest = async (packName: string): Promise<MsuPackManifest | null> => {
  const files = platformFiles();
  const tracks = await getTrackList(ctMsuConfig, files, packName);
  const manifest = await readManifest(ctMsuConfig, files, packName);
  if (!manifest && tracks.length === 0) return null;
  const classic = tracks.map(({ fileName, trackNum }) => ({ fileName, trackNum }));
  return effectivePackManifest(ctMsuConfig, packName, manifest, classic);
};

export { loadPackManifest };
