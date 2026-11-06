/* @layer renderer-components @kind hook */
import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import { useSettings } from '@drizztdourden08/brock-react';
import type { AppSettings } from '@app/settings.type';

const useNoticeColors = (): CSSProperties => {
  const { settings } = useSettings<AppSettings>();
  return useMemo(() => ({
    '--notice-item': settings.hudHighlightPrimary,
    '--notice-player': settings.hudHighlightSecondary,
  } as CSSProperties), [settings.hudHighlightPrimary, settings.hudHighlightSecondary]);
};

export { useNoticeColors };
