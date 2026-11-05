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
        description: 'Original uses the game width. Wide, Tall, Auto, Screen and Custom use 240 lines.',
        keywords: 'original widescreen 4:3 16:9 16:10 21:9 tall 3:4 4:5 custom auto detect screen',
      },
      gateItem('extendY'),
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
        key: 'displayPerfInTitle',
        label: 'Show FPS',
        description: 'Display the current frames per second, and the refresh rate of your display, in the title bar while the game is running',
        keywords: 'fps performance frame rate counter refresh rate hz',
      },
      {
        key: 'vsync',
        label: 'V-Sync',
        description: 'Paces the game against the display refresh rate instead of an internal timer, which smooths scrolling.',
        hint: 'Game speed stays the same either way.',
        keywords: 'vsync v-sync tearing judder stutter frame pacing refresh rate smooth scrolling 60hz',
      },
      gateItem('interpolate'),
      gateItem('freeSync'),
    ],
  },
];

export default sections;
export { meta };
