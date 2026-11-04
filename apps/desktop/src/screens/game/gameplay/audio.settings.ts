/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';

const meta: ScreenMeta = { title: 'Audio', icon: 'volume-2', order: 2, keywords: ['audio', 'sound', 'volume', 'mute', 'music'] };

const asPercent = (value: number): string => `${Math.round(value)}%`;

const sections: Section[] = [
  {
    id: 'volume',
    title: 'Volume',
    items: [
      {
        key: 'masterVolume',
        label: 'Master Volume',
        description: 'Controls the overall game volume, so it affects all audio output',
        control: { kind: 'range', min: 0, max: 100, step: 5, format: asPercent },
      },
    ],
  },
];

export default sections;
export { meta };
