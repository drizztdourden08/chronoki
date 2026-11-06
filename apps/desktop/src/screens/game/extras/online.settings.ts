/* @layer renderer-app @kind config */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { onlineSettingsSections } from '@drizztdourden08/brock-randomizer/renderer';
import { isOnlineExperimental } from '../../../shell/show-rules/is-online-experimental';

const meta: ScreenMeta = {
  title: 'Online',
  icon: 'globe',
  order: 3,
  when: isOnlineExperimental,
  keywords: ['online', 'archipelago', 'multiworld', 'deathlink', 'notifications'],
};

export default onlineSettingsSections;
export { meta };
