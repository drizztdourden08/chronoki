/* @layer renderer-app @kind logic */
import type { AppSettings } from '@app/settings.type';

const experimentalFeaturesEnabled = (settings: Pick<AppSettings, 'developerToolsEnabled' | 'experimentalFeaturesEnabled'>): boolean =>
  settings.developerToolsEnabled === true && settings.experimentalFeaturesEnabled === true;

export { experimentalFeaturesEnabled };
