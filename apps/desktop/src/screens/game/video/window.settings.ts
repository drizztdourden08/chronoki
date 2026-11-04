/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';

const meta: ScreenMeta = { title: 'Window', icon: 'app-window', order: 4, keywords: ['window', 'fullscreen', 'stretch', 'viewport', 'letterbox', 'pixel perfect'] };

const viewportModes = [
  { value: 'none', label: 'Letterbox', hint: 'Keeps the game ratio and fills the rest of the window with black bars.' },
  { value: 'fit', label: 'Fit Window', hint: 'Locks the window shape to the game ratio while you resize it, so no bars show.' },
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
        description: 'Automatically enter fullscreen when the game starts',
      },
      {
        key: 'viewportConstraint',
        label: 'Viewport',
        description: 'Controls how the game canvas relates to the window',
        keywords: 'ratio aspect black bars stretch fill fit letterbox viewport',
        control: { kind: 'choice', options: viewportModes },
      },
      {
        key: 'pixelPerfect',
        label: 'Pixel Perfect',
        description: 'Scale the picture by whole source pixels only, so every pixel is exactly the same size. Removes the shimmer on fences, walls and other straight edges while scrolling. The game draws a little more picture so it still fills your ratio, trimming at most a few edge lines. Turns Linear Filtering off while active.',
        hint: 'Needs the Letterbox viewport.',
        keywords: 'pixel perfect integer scale scaling sharp crisp nearest',
      },
    ],
  },
];

export default sections;
export { meta };
