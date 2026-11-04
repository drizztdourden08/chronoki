/* @layer renderer-appshell @kind logic */
import { aspectRatioValue } from '@drizztdourden08/brock-display/aspect-ratio';
import type { CkArea } from '@chronoki/game-core';
import type { PixelArea } from '@chronoki/features';
import { ASPECT_LIMITS } from '@app/settings-controls/display/display.constants';
import type { AppSettings } from '@app/settings.type';
import type { DisplayInputs } from './useCoreSettings.type';

const windowArea = (): CkArea => {
  const dpr = window.devicePixelRatio || 1;
  return { width: Math.round(window.innerWidth * dpr), height: Math.round(window.innerHeight * dpr) };
};

const clampRatio = (ratio: number): number => Math.min(ASPECT_LIMITS.max, Math.max(ASPECT_LIMITS.min, ratio));

const detectedRatio = (app: AppSettings, area: CkArea): number => {
  if (app.aspectRatio === 'auto' && area.width > 0 && area.height > 0) return clampRatio(area.width / area.height);
  return aspectRatioValue('screen', { customW: app.customAspectW, customH: app.customAspectH, limits: ASPECT_LIMITS });
};

const displayInputsOf = (app: AppSettings, stageArea: CkArea | null): DisplayInputs => {
  const area = stageArea ?? windowArea();
  const planned: PixelArea | undefined = app.viewportConstraint === 'fill' ? undefined : area;
  const wholePixels = app.pixelPerfect && app.viewportConstraint === 'none';
  return { screenRatio: detectedRatio(app, area), stageArea: planned, wholePixels };
};

export { displayInputsOf };
