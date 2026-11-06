/* @layer renderer-components @kind hook */
import { useCallback } from 'react';
import { useSettings } from '@drizztdourden08/brock-react';
import { isNoticeKindShown } from '@drizztdourden08/brock-randomizer/archipelago';
import type { NoticeKind } from '@drizztdourden08/brock-randomizer/archipelago';
import type { AppSettings } from '@app/settings.type';

const useNoticeShown = (): ((kind: NoticeKind) => boolean) => {
  const { settings } = useSettings<AppSettings>();
  return useCallback((kind: NoticeKind) => isNoticeKindShown(settings, kind), [settings]);
};

export { useNoticeShown };
