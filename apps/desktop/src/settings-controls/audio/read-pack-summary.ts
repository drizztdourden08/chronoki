/* @layer renderer-app @kind logic */
import { getTrackList, readManifest } from '@drizztdourden08/brock-msu/packs';
import { ctMsuConfig } from '@chronoki/game-core';
import { platformFiles } from '@app/storage/platform-files';
import type { DetectedPack } from './detected-pack.type';

const readPackSummary = async (packName: string): Promise<DetectedPack | null> => {
  const files = platformFiles();
  const [tracks, manifest] = await Promise.all([
    getTrackList(ctMsuConfig, files, packName),
    readManifest(ctMsuConfig, files, packName),
  ]);
  if (tracks.length === 0 && manifest === null) return null;
  const formats = [...new Set(tracks.map((t) => t.ext.toUpperCase()))].join('/');
  const loopCount = manifest?.tracks.filter((t) => t.layers.some((l) => l.loopSample !== undefined)).length ?? 0;
  return { name: packName, format: formats || 'manifest', trackCount: manifest?.tracks.length ?? tracks.length, loopCount };
};

export { readPackSummary };
