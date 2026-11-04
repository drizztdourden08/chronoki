/* @layer renderer-components @kind hook */
import { useSettings } from '@drizztdourden08/brock-react';
import type { AppSettings, ViewportMode } from '@app/settings.type';

const useViewport = (): { viewport: ViewportMode; pixelPerfect: boolean } => {
  const { settings } = useSettings<AppSettings>();
  if (settings.original) return { viewport: 'none', pixelPerfect: false };
  const viewport = settings.viewportConstraint;
  return { viewport, pixelPerfect: settings.pixelPerfect && viewport === 'none' };
};

export { useViewport };
