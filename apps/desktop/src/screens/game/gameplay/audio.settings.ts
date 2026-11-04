/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { gateItem } from '@app/settings-controls/gate-items';

const meta: ScreenMeta = {
  title: 'Audio',
  icon: 'volume-2',
  order: 2,
  keywords: ['audio', 'sound', 'volume', 'mute', 'music', 'uploads', 'instant'],
};

const sections: Section[] = [
  {
    id: 'volume',
    title: 'Volume',
    items: [
      {
        key: 'masterVolume',
        label: 'Master Volume',
        description: 'Controls the overall game volume, so it affects all audio output',
      },
    ],
  },
  { id: 'sound', title: 'Sound', items: [gateItem('instantUploads')] },
];

export default sections;
export { meta };
