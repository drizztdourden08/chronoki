/* @layer renderer-app @kind logic */
import type { DetectedPack } from './detected-pack.type';

const NO_PACK_LINE = 'None. No pack assigned to this profile.';

const detectedPackLine = (pack: DetectedPack | null): string =>
  pack === null ? NO_PACK_LINE : `${pack.name} · ${pack.format} · ${pack.trackCount} tracks · ${pack.loopCount} loop`;

export { detectedPackLine };
