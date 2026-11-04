/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { gateItem } from '@app/settings-controls/gate-items';
import { ASPECT_OPTIONS } from './aspect-options.constants';

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
        description: 'Original keeps the game width. The others set the shape of the picture; Auto and Screen follow your display.',
        hint: 'Needs Extended Rendering. The letterboxed shapes need Tall Rendering.',
        keywords: 'aspect ratio widescreen original 4:3 16:9 16:10 21:9 tall 3:4 4:5 auto screen custom extended rendering',
        control: { kind: 'choice', options: ASPECT_OPTIONS, look: 'select' },
      },
      {
        key: 'customAspectW',
        label: 'Custom Aspect Width',
        description: 'The width part of the custom ratio.',
        keywords: 'custom aspect ratio width',
        control: { kind: 'number', min: 1, max: 64, step: 1 },
        visibleWhen: { key: 'aspectRatio', equals: 'custom' },
      },
      {
        key: 'customAspectH',
        label: 'Custom Aspect Height',
        description: 'The height part of the custom ratio.',
        keywords: 'custom aspect ratio height',
        control: { kind: 'number', min: 1, max: 64, step: 1 },
        visibleWhen: { key: 'aspectRatio', equals: 'custom' },
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
