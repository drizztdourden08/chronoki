/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { gateItem } from '@app/settings-controls/gate-items';

const meta: ScreenMeta = { title: 'Audio', icon: 'volume-2', order: 2, keywords: ['audio', 'sound', 'volume', 'mute', 'music', 'uploads'] };

const asPercent = (value: number): string => `${Math.round(value * 100)}%`;

const sections: Section[] = [
  {
    id: 'output',
    title: 'Output',
    items: [
      { key: 'enableAudio', label: 'Audio', description: 'Play sound.', hint: 'Off mutes every sound the app plays, whatever the volume.' },
      {
        key: 'masterVolume',
        label: 'Master volume',
        description: 'Overall output level.',
        hint: 'Drag to scale every sound at once. 100% plays them as made.',
        control: { kind: 'range', min: 0, max: 1, step: 0.05, format: asPercent },
      },
    ],
  },
  {
    id: 'timing',
    title: 'Timing',
    items: [gateItem('instantUploads')],
  },
];

export default sections;
export { meta };
