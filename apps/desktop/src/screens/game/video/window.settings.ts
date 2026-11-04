/* @layer renderer-app @kind config */
import { widgets } from '@drizztdourden08/brock-react';
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { gateItem } from '@app/settings-controls/gate-items';

const meta: ScreenMeta = { title: 'Window', icon: 'app-window', order: 2, keywords: ['window', 'fullscreen', 'borderless', 'stretch', 'filtering', 'widget layout'] };

const windowModes = [
  { value: 'windowed', label: 'Windowed', hint: 'A normal window you can move and resize.' },
  { value: 'borderless', label: 'Borderless', hint: 'Fills the screen without a frame, and other windows can still go on top.' },
  { value: 'fullscreen', label: 'Fullscreen', hint: 'Takes over the display until you leave fullscreen.' },
];

const sections: Section[] = [
  {
    id: 'window',
    title: 'Window',
    items: [
      {
        key: 'windowMode',
        label: 'Window mode',
        description: 'Windowed, borderless or fullscreen.',
        hint: 'Pick how the window sits on the screen. It changes right away.',
        control: { kind: 'choice', options: windowModes },
      },
      {
        key: 'startFullscreen',
        label: 'Start fullscreen',
        description: 'Open in fullscreen on launch.',
        hint: 'On, the app opens fullscreen the next time it starts. The window you have now stays as it is.',
      },
      {
        key: 'showFps',
        label: 'Show FPS',
        description: 'Frame rate and refresh rate in the title bar.',
        hint: 'On, the title bar shows how many frames the game draws each second and the display refresh rate.',
      },
    ],
  },
  {
    id: 'viewport',
    title: 'Viewport',
    items: [gateItem('scaleStretch'), gateItem('linearFiltering')],
  },
  {
    id: 'layout',
    title: 'Layout',
    items: [
      {
        key: 'widgetLayout',
        label: 'Widget layout',
        description: 'Put the widgets back where they start.',
        hint: 'Closes the widgets you opened and docks the others where the app first placed them.',
        actions: [{ id: 'reset-layout', label: 'Reset', icon: 'rotate-ccw', tone: 'danger', confirm: 'Reset the layout?', onSelect: () => widgets.reset() }],
      },
    ],
  },
];

export default sections;
export { meta };
