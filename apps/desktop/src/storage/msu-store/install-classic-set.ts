/* @layer renderer-lib @kind logic */
import { createPack, installTracks, listPacks } from '@drizztdourden08/brock-msu/packs';
import { platformFiles } from '../platform-files';
import { ctMsuConfig } from '@chronoki/game-core';
import { CLASSIC_TRACK_PATTERN, NO_TRACKS_ERROR } from './msu-store.constants';
import type { MsuImportProgress, MsuImportResult, MsuSourceFile } from './msu-store.type';
import { unusedPackName } from './unused-pack-name';

const installClassicSet = async (wanted: string, sources: MsuSourceFile[], onProgress?: MsuImportProgress): Promise<MsuImportResult> => {
  const tracks = sources.filter((source) => CLASSIC_TRACK_PATTERN.test(source.name));
  if (tracks.length === 0) return { success: false, error: NO_TRACKS_ERROR };
  const files = platformFiles();
  const pack = unusedPackName(wanted, (await listPacks(ctMsuConfig, files)).map((p) => p.name));
  await createPack(ctMsuConfig, files, pack);
  for (const [index, track] of tracks.entries()) {
    await installTracks(ctMsuConfig, files, pack, [track]);
    onProgress?.(index + 1, tracks.length);
  }
  return { success: true, pack, fileCount: tracks.length };
};

export { installClassicSet };
