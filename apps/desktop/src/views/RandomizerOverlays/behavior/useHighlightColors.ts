/* @layer renderer-components @kind hook */
import { useSettings } from '@drizztdourden08/brock-react';
import type { AppSettings } from '@app/settings.type';

const useHighlightColors = (): { itemColor: string; playerColor: string } => {
  const { settings } = useSettings<AppSettings>();
  return { itemColor: settings.hudHighlightPrimary, playerColor: settings.hudHighlightSecondary };
};

export { useHighlightColors };
