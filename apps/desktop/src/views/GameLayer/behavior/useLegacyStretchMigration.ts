/* @layer renderer-components @kind hook */
import { useEffect } from 'react';
import { useSettings } from '@drizztdourden08/brock-react';
import type { AppSettings } from '@app/settings.type';
import { LEGACY_STRETCH_GATE } from '../GameLayer.constants';

/* The old "Stretch to window" gate became the Stretch viewport choice: carry a saved "on" over once. */
const useLegacyStretchMigration = (): void => {
  const { settings, patch } = useSettings<AppSettings>();
  const { gates } = settings;
  useEffect(() => {
    if (!gates.includes(LEGACY_STRETCH_GATE)) return;
    patch({ gates: gates.filter((id) => id !== LEGACY_STRETCH_GATE), viewportConstraint: 'fill' });
  }, [gates, patch]);
};

export { useLegacyStretchMigration };
