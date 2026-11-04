/* @layer renderer-components @kind hook */
import { useMemo } from 'react';
import { useSettings } from '@drizztdourden08/brock-react';
import { letterboxBox } from '@chronoki/game-core';
import type { CkFrameSize } from '@chronoki/game-core';
import type { AppSettings } from '@app/settings.type';
import type { PresentBox } from '../GameLayer.type';
import { presentRatioOf } from './present-ratio-of';

const usePresentBox = (gates: ReadonlySet<string>, frame: CkFrameSize): PresentBox => {
  const { settings } = useSettings<AppSettings>();
  const { aspectRatio, customAspectW, customAspectH } = settings;
  const { width, height } = frame;
  return useMemo(() => {
    const ratio = presentRatioOf({ gates, aspectRatio, customAspectW, customAspectH });
    const box = ratio > 0 ? letterboxBox(ratio) : { width, height };
    const boxed = box.height > height;
    return boxed ? { width: box.width, height: box.height, boxed } : { width, height, boxed };
  }, [gates, aspectRatio, customAspectW, customAspectH, width, height]);
};

export { usePresentBox };
