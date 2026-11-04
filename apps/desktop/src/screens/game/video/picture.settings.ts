/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { gateItem } from '@app/settings-controls/gate-items';

const meta: ScreenMeta = {
  title: 'Picture',
  icon: 'image',
  order: 1,
  keywords: ['picture', 'extended rendering', 'widescreen', 'aspect', 'fps', 'performance', 'interpolation', 'free sync', 'steam'],
};

const aspects = [
  { value: '16:9', label: '16:9' },
  { value: '16:10', label: '16:10' },
  { value: '21:9', label: '21:9' },
];

const sections: Section[] = [
  {
    id: 'picture',
    title: 'Picture',
    items: [
      gateItem('widescreen'),
      {
        key: 'widescreenAspect',
        label: 'Aspect Ratio',
        description: 'The shape of the wide picture, with 16:9 suiting most screens.',
        hint: 'Needs Extended Rendering.',
        keywords: 'aspect ratio widescreen 16:9 16:10 21:9 extended rendering',
        control: { kind: 'choice', options: aspects },
      },
      gateItem('sceneAdjust'),
      gateItem('wideSteamMargins'),
      gateItem('fillBottomLine'),
    ],
  },
  {
    id: 'performance',
    title: 'Performance',
    items: [
      {
        key: 'showFps',
        label: 'Show FPS',
        description: 'Display the current frames per second, and the refresh rate of your display, in the title bar while the game is running',
      },
      gateItem('interpolate'),
      gateItem('freeSync'),
    ],
  },
];

export default sections;
export { meta };
