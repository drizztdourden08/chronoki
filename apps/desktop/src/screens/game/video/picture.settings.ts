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
        description: 'Original uses the game width. Wide, Tall, Auto, Screen and Custom use 224 lines.',
        keywords: 'original widescreen 4:3 16:9 16:10 21:9 tall 3:4 4:5 custom auto detect screen',
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
