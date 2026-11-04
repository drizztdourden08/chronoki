/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { gateItem } from '@app/settings-controls/gate-items';

const meta: ScreenMeta = { title: 'Window', icon: 'app-window', order: 2, keywords: ['window', 'fullscreen', 'stretch', 'viewport', 'letterbox', 'pixel perfect', 'filtering'] };

const viewportModes = [
  { value: 'none', label: 'Letterbox', hint: 'Keeps the game ratio and fills the rest of the window with black bars.' },
  { value: 'fit', label: 'Fit Window', hint: 'Fills the window as far as the game ratio allows, and resizing the window keeps the game ratio.' },
  { value: 'fill', label: 'Stretch', hint: 'Stretches the picture to fill the whole window.' },
];

const sections: Section[] = [
  {
    id: 'window',
    title: 'Window',
    items: [
      {
        key: 'startFullscreen',
        label: 'Start in Fullscreen',
        description: 'Opens the app in fullscreen the next time it starts.',
      },
      {
        key: 'viewportConstraint',
        label: 'Viewport',
        description: 'How the picture relates to the window.',
        hint: 'Original Mode always uses Letterbox.',
        keywords: 'ratio aspect black bars stretch fill fit letterbox viewport',
        control: { kind: 'choice', options: viewportModes },
      },
      {
        key: 'pixelPerfect',
        label: 'Pixel Perfect',
        description: 'Scales the picture by whole pixels only, with wider black borders, and turns Linear Filtering off while on.',
        hint: 'Needs the Letterbox viewport.',
        keywords: 'pixel perfect integer scale scaling sharp crisp nearest',
      },
      gateItem('linearFiltering'),
    ],
  },
];

export default sections;
export { meta };
