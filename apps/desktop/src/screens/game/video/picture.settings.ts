/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { gateItem } from '@app/settings-controls/gate-items';

const meta: ScreenMeta = {
  title: 'Picture',
  icon: 'image',
  order: 1,
  keywords: ['picture', 'extended rendering', 'widescreen', 'aspect', 'tall', 'custom ratio', 'fps', 'performance', 'interpolation', 'free sync', 'steam'],
};

const sections: Section[] = [
  {
    id: 'picture',
    title: 'Picture',
    items: [
      gateItem('widescreen'),
      gateItem('tallRendering'),
      {
        key: 'aspectRatio',
        label: 'Aspect Ratio',
        description: 'Original uses the game width. Wide, Auto, Screen and Custom add width at 224 lines. Tall adds lines at the game width.',
        keywords: 'aspect ratio widescreen original 4:3 16:9 16:10 21:9 tall 3:4 4:5 auto screen custom extended rendering',
        control: { kind: 'choice', options: [], look: 'select' },
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
