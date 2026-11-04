/* @layer renderer-appshell @kind hook */
import { useEffect, useRef } from 'react';
import { useSettings } from '@drizztdourden08/brock-react';
import { toast } from '@drizztdourden08/tessera/composites';
import { applySettingsEffects } from '@app/settings-effects/apply-settings-effects';
import { RESTART_TOAST_ID } from '@app/settings-effects/settings-effects.constants';
import type { AppSettings } from '@app/settings.type';

const useRestartWarning = (running: boolean, launchId: number | null): void => {
  const { settings } = useSettings<AppSettings>();
  const prevRef = useRef(settings);
  const shownRef = useRef(false);

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = settings;
    if (prev !== settings) applySettingsEffects(prev, settings, running, { restartToastShownRef: shownRef });
  }, [settings, running]);

  useEffect(() => {
    shownRef.current = false;
    toast.dismiss(RESTART_TOAST_ID);
  }, [launchId]);
};

export { useRestartWarning };
