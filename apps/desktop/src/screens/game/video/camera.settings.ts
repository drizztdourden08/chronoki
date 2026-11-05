/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { gateItem } from '@app/settings-controls/gate-items';

const meta: ScreenMeta = { title: 'Camera', icon: 'image', order: 3, keywords: ['camera', 'scroll', 'lock'] };

const sections: Section[] = [
  {
    id: 'camera',
    title: 'Camera',
    items: [gateItem('cameraLock')],
  },
];

export default sections;
export { meta };
