/* @layer renderer-app @kind logic */
import { NO_PACK_LINE } from './detected-pack-line.constants';
import type { DetectedPack } from './detected-pack.type';

const detectedPackLine = (pack: DetectedPack | null): string =>
  pack === null ? NO_PACK_LINE : `${pack.name} · ${pack.format} · ${pack.trackCount} tracks · ${pack.loopCount} loop`;

export { detectedPackLine };
