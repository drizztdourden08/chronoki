/* @layer renderer-appshell @kind hook */
import { useSettings, useShowFlags } from '@drizztdourden08/brock-react';
import { experimentalFeaturesEnabled } from '@app/shell/show-rules/experimental-features-enabled';
import type { AppSettings } from '@app/settings.type';

const useExperimentalFlag = (): void => {
  const { settings } = useSettings<AppSettings>();
  useShowFlags({ experimental: experimentalFeaturesEnabled(settings) });
};

export { useExperimentalFlag };
