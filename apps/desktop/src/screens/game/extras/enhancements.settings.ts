/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { gateItem } from '@app/settings-controls/gate-items';

const meta: ScreenMeta = {
  title: 'Enhancements',
  icon: 'sparkles',
  order: 1,
  keywords: ['enhancements', 'belthasar', 'interpolation', 'steam', 'free sync','scene', 'bottom lines'],
};

const sections: Section[] = [
  { id: 'motion', title: 'Motion', items: [gateItem('interpolate'), gateItem('freeSync')] },
  { id: 'widescreen', title: 'Widescreen', items: [gateItem('sceneAdjust'), gateItem('wideSteamMargins'), gateItem('fillBottomLine')] },
];

export default sections;
export { meta };
