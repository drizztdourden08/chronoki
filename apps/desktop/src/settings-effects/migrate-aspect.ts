/* @layer renderer-app @kind logic */
import { aspectAfterTall } from '@chronoki/features';
import type { AspectRatioChoice } from '@chronoki/features';
import { LEGACY_ASPECT_CHOICES } from './normalise-settings.constants';

const migrateAspect = (aspectRatio: AspectRatioChoice, legacy: unknown, gates: readonly string[]): AspectRatioChoice => {
  const migrated = LEGACY_ASPECT_CHOICES.find((choice) => choice === legacy) ?? aspectRatio;
  return aspectAfterTall(migrated, gates.includes('tallRendering'));
};

export { migrateAspect };
