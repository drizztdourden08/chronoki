/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { gateItem } from '@app/settings-controls/gate-items';

const meta: ScreenMeta = {
  title: 'Picture',
  icon: 'image',
  order: 1,
  keywords: ['picture', 'widescreen', 'aspect', 'scale', 'resolution', 'fps', 'performance'],
};

const aspects = [
  { value: '16:9', label: '16:9' },
  { value: '16:10', label: '16:10' },
  { value: '21:9', label: '21:9' },
];

const sections: Section[] = [
  {
    id: 'widescreen',
    title: 'Widescreen',
    items: [
      gateItem('widescreen'),
      {
        key: 'widescreenAspect',
        label: 'Aspect Ratio',
        description: 'The shape of the wide picture, with 16:9 suiting most screens.',
        hint: 'Needs Widescreen.',
        control: { kind: 'choice', options: aspects },
      },
    ],
  },
  {
    id: 'resolution',
    title: 'Resolution',
    items: [
      gateItem('renderScale'),
      {
        key: 'renderScale',
        label: 'Render Scale',
        description: 'How many times the SNES size the picture is drawn at, from 2x to 4x.',
        hint: 'Needs Internal Resolution.',
      },
    ],
  },
  {
    id: 'performance',
    title: 'Performance',
    items: [
      {
        key: 'showFps',
        label: 'Show FPS',
        description: 'Display the current frames per second, and the refresh rate of your display, in the title bar while the game is running.',
      },
    ],
  },
];

export default sections;
export { meta };
